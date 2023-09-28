import createError from 'http-errors'
import type { RequestHandler } from 'express'
import type { NewGoal } from 'compositeForms'
import moment from 'moment'
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

    req.session.newGoals = req.session.newGoals || []
    if (!req.session.newGoal?.createGoalForm) {
      req.session.newGoal = {
        createGoalForm: { prisonNumber },
      } as NewGoal
    }

    const futureGoalTargetDates = [
      {
        text: moment(moment().add(3, 'months').toDate()).format('YYYY-MM-DD'),
        value: `in 3 months (${moment(moment().add(3, 'months').toDate()).format('D MMMM YYYY')})`,
      },
      {
        text: moment(moment().add(6, 'months').toDate()).format('YYYY-MM-DD'),
        value: `in 6 months (${moment(moment().add(6, 'months').toDate()).format('D MMMM YYYY')})`,
      },
      {
        text: moment(moment().add(12, 'months').toDate()).format('YYYY-MM-DD'),
        value: `in 12 months (${moment(moment().add(12, 'months').toDate()).format('D MMMM YYYY')})`,
      },
    ]

    const view = new CreateGoalView(
      prisonerSummary,
      req.session.newGoal.createGoalForm,
      futureGoalTargetDates,
      req.flash('errors'),
    )
    res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  submitCreateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal.createGoalForm = { ...req.body }

    const errors = validateCreateGoalForm(req.session.newGoal.createGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const addStepForm = req.session.newGoal.addStepForm || { stepNumber: 1 }
    req.session.newGoal.addStepForms = req.session.newGoal.addStepForms || []

    const view = new AddStepView(prisonerSummary, addStepForm, req.flash('errors'))
    res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  submitAddStepForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal.addStepForm = { ...req.body }
    const { addStepForm, addStepForms } = req.session.newGoal

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
    }

    // Redirect to the desired page based on the form action
    if (addStepForm.action === 'add-another-step') {
      // Initialize a new AddStepForm with the next step number
      const nextStepNumber = Number(addStepForm.stepNumber) + 1
      req.session.newGoal.addStepForm = { stepNumber: nextStepNumber }
      return res.redirect(`/plan/${prisonNumber}/goals/add-step`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/add-note`)
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const addNoteForm = req.session.newGoal.addNoteForm || {}

    const view = new AddNoteView(prisonerSummary, addNoteForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }

  submitAddNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.newGoal.addNoteForm = { ...req.body }

    req.session.newGoals.push(req.session.newGoal)
    req.session.newGoal = undefined

    return res.redirect(`/plan/${prisonNumber}/goals/review`)
  }

  getReviewGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const { prisonId } = prisonerSummary

    const createGoalDtos = req.session.newGoals.map(newGoal => {
      const { createGoalForm, addStepForms, addNoteForm } = newGoal
      return toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)
    })

    const view = new ReviewView(prisonerSummary, createGoalDtos)
    res.render('pages/goal/review/index', { ...view.renderArgs })
  }

  submitReviewGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { prisonId } = prisonerSummary

    const reviewGoalForm = { ...req.body }
    // Redirect to the desired page based on the form action
    if (reviewGoalForm.action === 'add-another-goal') {
      // Rest the NewGoal form ready for the new goal to be created
      req.session.newGoal = undefined
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    const createGoalDtos = req.session.newGoals.map(newGoal => {
      const { createGoalForm, addStepForms, addNoteForm } = newGoal
      return toCreateGoalDto(createGoalForm, addStepForms, addNoteForm, prisonId)
    })

    try {
      await this.educationAndWorkPlanService.createGoals(createGoalDtos, req.user.token)

      req.session.newGoal = undefined
      req.session.newGoals = undefined
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      return next(createError(500, `Error updating plan for prisoner ${prisonNumber}`))
    }
  }
}
