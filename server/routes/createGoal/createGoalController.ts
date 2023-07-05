import type { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import CreateGoalView from './createGoalView'
import AddStepView from './addStepView'
import AddNoteView from './addNoteView'
import validateCreateGoalForm from './createGoalFormValidator'
import parseDate from '../parseDate'
import validateAddStepForm from './addStepFormValidator'
import CreateGoalFormToCreateGoalDtoMapper from './createGoalFormToCreateGoalDtoMapper'
import logger from '../../../logger'

export default class CreateGoalController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
  ) {}

  private static createDtoMapper(): CreateGoalFormToCreateGoalDtoMapper {
    return new CreateGoalFormToCreateGoalDtoMapper()
  }

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, req.user.token)
    } catch (error) {
      next(createError(404, 'Prisoner not found'))
      return
    }

    const prisonerSummary = {
      prisonNumber: prisoner.prisonerNumber,
      releaseDate: prisoner.releaseDate,
      location: prisoner.cellLocation,
      firstName: prisoner.firstName,
      lastName: prisoner.lastName,
    } as PrisonerSummary
    req.session.prisonerSummary = prisonerSummary

    const createGoalForm = req.session.createGoalForm || {}

    const view = new CreateGoalView(prisonerSummary, createGoalForm, req.flash('errors'))
    res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  submitCreateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params

    const reviewDate = parseDate(req, 'reviewDate')
    req.session.createGoalForm = { ...req.body, reviewDate }

    const errors = validateCreateGoalForm(req.session.createGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const { createGoalForm } = req.session
    const addStepForm = req.session.addStepForm || { stepNumber: 1 }

    const view = new AddStepView(createGoalForm.title, prisonerSummary, addStepForm, req.flash('errors'))
    res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  submitAddStepForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const targetDate = parseDate(req, 'targetDate')
    req.session.addStepForm = { ...req.body, targetDate }
    const { addStepForm } = req.session

    const errors = validateAddStepForm(addStepForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    // Redirect to the desired page based on the form action
    if (addStepForm.action === 'add-another-step') {
      // The next PR will work out where to store steps as each is submitted

      // Initialize a new AddStepForm with the next step number
      const nextStepNumber = Number(addStepForm.stepNumber) + 1
      req.session.addStepForm = { stepNumber: nextStepNumber }
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-note`)
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    // const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const addNoteForm = req.session.addNoteForm || {}

    const view = new AddNoteView(prisonerSummary, addNoteForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }

  submitAddNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { createGoalForm } = req.session
    const { addStepForm } = req.session
    req.session.addNoteForm = { ...req.body }

    const createGoalDto = CreateGoalController.createDtoMapper().toCreateGoalDto(
      prisonNumber,
      createGoalForm,
      addStepForm,
      req.body,
    )
    logger.info(createGoalDto)
    await this.educationAndWorkPlanService.createGoal(createGoalDto, req.user.token)

    return res.redirect(`/plan/${prisonNumber}/goals/overview`)
  }
}
