import createError from 'http-errors'
import type { RequestHandler } from 'express'
import type { NewGoal } from 'compositeForms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import CreateGoalView from './createGoalView'
import AddStepView from './addStepView'
import AddNoteView from './addNoteView'
import { toCreateGoalDto } from './mappers/createGoalFormToCreateGoalDtoMapper'
import validateCreateGoalForm from './createGoalFormValidator'
import validateAddStepForm from './addStepFormValidator'
import ReviewView from './reviewView'

export default class CreateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    if (!req.session.newGoalForm?.createGoalForm) {
      req.session.newGoalForm = {
        createGoalForm: { prisonNumber },
      } as NewGoal
    }

    const view = new CreateGoalView(prisonerSummary, req.session.newGoalForm.createGoalForm, req.flash('errors'))
    res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  submitCreateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoalForm.createGoalForm = { ...req.body }

    const errors = validateCreateGoalForm(req.session.newGoalForm.createGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const addStepForm = req.session.newGoalForm.addStepForm || { stepNumber: 1 }
    req.session.newGoalForm.addStepForms = req.session.newGoalForm.addStepForms || []

    const view = new AddStepView(prisonerSummary, addStepForm, req.flash('errors'))
    res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  submitAddStepForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoalForm.addStepForm = { ...req.body }
    const { addStepForm, addStepForms } = req.session.newGoalForm

    const errors = validateAddStepForm(addStepForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    // check to see if this step has already been added (e.g. after the user clicks the back button)
    const existingAddStepForm = addStepForms.find(step => step.stepNumber === addStepForm.stepNumber)
    if (!existingAddStepForm) {
      addStepForms.push(addStepForm)
    } else {
      // update it in case the user has clicked back and changed it
      existingAddStepForm.title = addStepForm.title
      existingAddStepForm.targetDateRange = addStepForm.targetDateRange
    }

    // Redirect to the desired page based on the form action
    if (addStepForm.action === 'add-another-step') {
      // Initialize a new AddStepForm with the next step number
      const nextStepNumber = Number(addStepForm.stepNumber) + 1
      req.session.newGoalForm.addStepForm = { stepNumber: nextStepNumber }
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-note`)
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const addNoteForm = req.session.newGoalForm.addNoteForm || {}

    const view = new AddNoteView(prisonerSummary, addNoteForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }

  submitAddNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoalForm.addNoteForm = { ...req.body }

    return res.redirect(`/plan/${prisonNumber}/goals/review`)
  }

  getReviewGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const { createGoalForm, addStepForms, addNoteForm } = req.session.newGoalForm

    const { prisonId } = prisonerSummary
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)

    const view = new ReviewView(prisonerSummary, createGoalDto)
    res.render('pages/goal/review/index', { ...view.renderArgs })
  }

  submitReviewGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { createGoalForm, addStepForms, addNoteForm } = req.session.newGoalForm

    const { prisonId } = prisonerSummary
    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)

    try {
      await this.educationAndWorkPlanService.createGoal(createGoalDto, req.user.token)

      req.session.newGoalForm = undefined
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      return next(createError(500, `Error updating plan for prisoner ${prisonNumber}`))
    }
  }
}
