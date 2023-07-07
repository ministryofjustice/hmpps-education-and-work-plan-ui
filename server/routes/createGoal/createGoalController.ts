import type { RequestHandler } from 'express'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import createError from 'http-errors'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import PrisonerSearchService from '../../services/prisonerSearchService'
import CreateGoalView from './createGoalView'
import AddStepView from './addStepView'
import AddNoteView from './addNoteView'
import { toCreateGoalDto } from './mappers/createGoalFormToCreateGoalDtoMapper'
import validateCreateGoalForm from './createGoalFormValidator'
import parseDate from '../parseDate'
import validateAddStepForm from './addStepFormValidator'

export default class CreateGoalController {
  constructor(
    private readonly prisonerSearchService: PrisonerSearchService,
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
  ) {}

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    if (!req.session.createGoalForm) {
      req.session.createGoalForm = { prisonNumber }
    }

    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchService.getPrisonerByPrisonNumber(prisonNumber, req.user.token)
    } catch (error) {
      req.session.createGoalForm = undefined
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

    const view = new CreateGoalView(prisonerSummary, req.session.createGoalForm, req.flash('errors'))
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
    req.session.addStepForms = req.session.addStepForms || []

    const view = new AddStepView(createGoalForm.title, prisonerSummary, addStepForm, req.flash('errors'))
    res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  submitAddStepForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const targetDate = parseDate(req, 'targetDate')
    req.session.addStepForm = { ...req.body, targetDate }
    const { addStepForm } = req.session
    const { addStepForms } = req.session

    const errors = validateAddStepForm(addStepForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }
    addStepForms.push(req.session.addStepForm)

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
    const { addStepForms } = req.session
    req.session.addNoteForm = { ...req.body }

    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, req.body)
    await this.educationAndWorkPlanService.createGoal(createGoalDto, req.user.token)

    req.session.createGoalForm = undefined
    req.session.addStepForm = undefined
    req.session.addStepForms = undefined
    req.session.addNoteForm = undefined

    return res.redirect(`/plan/${prisonNumber}/goals/overview`)
  }
}
