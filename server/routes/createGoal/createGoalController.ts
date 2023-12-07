import createError from 'http-errors'
import type { Request, RequestHandler } from 'express'
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
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'

export default class CreateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getCreateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalIndex } = req.params
    const { prisonerSummary } = req.session

    req.session.newGoals = req.session.newGoals || []

    if (isEditMode(req)) {
      if (!req.session.newGoals[parseInt(goalIndex, 10) - 1]) {
        return next(createError(404, `Goal ${goalIndex} not found`))
      }
      // User is editing a Goal via it's Change link - get the relevant `NewGoal` object from the session based on the goalIndex path param
      req.session.newGoal = {
        createGoalForm: req.session.newGoals[parseInt(goalIndex, 10) - 1].createGoalForm,
      } as NewGoal
    } else if (!req.session.newGoal?.createGoalForm) {
      // User is creating a new Goal
      req.session.newGoal = {
        createGoalForm: { prisonNumber },
      } as NewGoal
    }

    const today = moment().toDate()
    const futureGoalTargetDates = [
      futureGoalTargetDateCalculator(today, 3),
      futureGoalTargetDateCalculator(today, 6),
      futureGoalTargetDateCalculator(today, 12),
    ]

    const view = new CreateGoalView(
      prisonerSummary,
      req.session.newGoal.createGoalForm,
      futureGoalTargetDates,
      isEditMode(req),
      req.flash('errors'),
    )
    return res.render('pages/goal/create/index', { ...view.renderArgs })
  }

  submitCreateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalIndex } = req.params

    req.session.newGoal.createGoalForm = { ...req.body }
    const { createGoalForm } = req.session.newGoal

    const errors = validateCreateGoalForm(createGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/${goalIndex}/create`)
    }

    if (isEditMode(req)) {
      if (!req.session.newGoals[parseInt(goalIndex, 10) - 1]) {
        return next(createError(404, `Goal ${goalIndex} not found`))
      }
      req.session.newGoals[parseInt(goalIndex, 10) - 1].createGoalForm = req.session.newGoal.createGoalForm
      req.session.newGoal = undefined
      return res.redirect(`/plan/${prisonNumber}/goals/review`)
    }
    return res.redirect(`/plan/${prisonNumber}/goals/${goalIndex}/add-step/1`)
  }

  getAddStepView: RequestHandler = async (req, res, next): Promise<void> => {
    const { goalIndex, stepIndex } = req.params
    const { prisonerSummary } = req.session

    req.session.newGoal.addStepForms = req.session.newGoal.addStepForms || []

    if (isEditMode(req)) {
      req.session.newGoal = {
        createGoalForm: req.session.newGoals[parseInt(goalIndex, 10) - 1].createGoalForm,
        addStepForm: req.session.newGoals[parseInt(goalIndex, 10) - 1].addStepForms[parseInt(stepIndex, 10) - 1],
      } as NewGoal
    } else if (!req.session.newGoal.addStepForm) {
      req.session.newGoal.addStepForm = { stepNumber: 1 }
    }

    const { addStepForm } = req.session.newGoal

    const view = new AddStepView(prisonerSummary, addStepForm, isEditMode(req), req.flash('errors'))
    return res.render('pages/goal/add-step/index', { ...view.renderArgs })
  }

  submitAddStepForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalIndex, stepIndex } = req.params

    req.session.newGoal.addStepForm = { ...req.body }
    const { addStepForm, addStepForms } = req.session.newGoal

    const errors = validateAddStepForm(addStepForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/${goalIndex}/add-step/${stepIndex}`)
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
      return res.redirect(`/plan/${prisonNumber}/goals/${goalIndex}/add-step/${nextStepNumber}`)
    }

    if (isEditMode(req)) {
      if (!req.session.newGoals[parseInt(goalIndex, 10) - 1]) {
        return next(createError(404, `Goal ${goalIndex} not found`))
      }
      if (!req.session.newGoals[parseInt(stepIndex, 10) - 1].addStepForm) {
        return next(createError(404, `Step ${stepIndex} not found`))
      }
      req.session.newGoals[parseInt(goalIndex, 10) - 1].addStepForm = req.session.newGoal.addStepForm
      req.session.newGoal = undefined
      return res.redirect(`/plan/${prisonNumber}/goals/review`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/${goalIndex}/add-note`)
  }

  getAddNoteView: RequestHandler = async (req, res, next): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { goalIndex } = req.params
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mode } = req.query
    const { prisonerSummary } = req.session
    const addNoteForm = req.session.newGoal.addNoteForm || {}

    const view = new AddNoteView(prisonerSummary, addNoteForm, req.flash('errors'))
    res.render('pages/goal/add-note/index', { ...view.renderArgs })
  }

  submitAddNoteForm: RequestHandler = async (req, res, next): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prisonNumber, goalIndex } = req.params
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mode } = req.query
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
      // Reset the NewGoal form ready for the new goal to be created
      req.session.newGoal = undefined
      const nextGoalIndex = req.session.newGoals.length + 1
      return res.redirect(`/plan/${prisonNumber}/goals/${nextGoalIndex}/create`)
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

const isEditMode = (req: Request): boolean => req.query?.mode === 'edit'
