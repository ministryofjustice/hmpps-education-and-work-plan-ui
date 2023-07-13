import type { RequestHandler } from 'express'
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
    if (!req.session.createGoalForm) {
      req.session.createGoalForm = { prisonNumber }
    }

    const view = new CreateGoalView(prisonerSummary, req.session.createGoalForm, req.flash('errors'))
    res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  submitCreateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.createGoalForm = { ...req.body }

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
    req.session.addStepForm = { ...req.body }
    const { addStepForm, addStepForms } = req.session

    const errors = validateAddStepForm(addStepForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    // check to see if this step has already been added (e.g. after the user clicks the back button)
    const existingAddStepForm = addStepForms.find(step => step.stepNumber === addStepForm.stepNumber)
    if (!existingAddStepForm) {
      addStepForms.push(req.session.addStepForm)
    } else {
      // update it in case the user has clicked back and changed it
      existingAddStepForm.title = addStepForm.title
      existingAddStepForm.targetDateRange = addStepForm.targetDateRange
    }

    // Redirect to the desired page based on the form action
    if (addStepForm.action === 'add-another-step') {
      // Initialize a new AddStepForm with the next step number
      const nextStepNumber = Number(addStepForm.stepNumber) + 1
      req.session.addStepForm = { stepNumber: nextStepNumber }
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-note`)
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const addNoteForm = req.session.addNoteForm || {}

    const view = new AddNoteView(prisonerSummary, addNoteForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }

  submitAddNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.addNoteForm = { ...req.body }

    return res.redirect(`/plan/${prisonNumber}/goals/review`)
  }

  getReviewGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const { createGoalForm } = req.session
    const { addStepForms } = req.session
    const { addNoteForm } = req.session

    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm)

    const view = new ReviewView(prisonerSummary, createGoalDto)
    res.render('pages/goal/review/index', { ...view.renderArgs })
  }

  submitReviewGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { createGoalForm } = req.session
    const { addStepForms } = req.session
    const { addNoteForm } = req.session

    const createGoalDto = toCreateGoalDto(createGoalForm, addStepForms, addNoteForm)
    await this.educationAndWorkPlanService.createGoal(createGoalDto, req.user.token)

    req.session.createGoalForm = undefined
    req.session.addStepForm = undefined
    req.session.addStepForms = undefined
    req.session.addNoteForm = undefined
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
