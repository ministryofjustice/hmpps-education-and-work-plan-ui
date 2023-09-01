import createError from 'http-errors'
import type { RequestHandler } from 'express'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalView from './updateGoalView'
import ReviewUpdateGoalView from './reviewUpdateGoalView'
import { toUpdateGoalForm } from './mappers/goalToUpdateGoalFormMapper'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { toUpdateGoalDto } from './mappers/updateGoalFormToUpdateGoalDtoMapper'

export default class UpdateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    let updateGoalForm: UpdateGoalForm
    if (req.session.updateGoalForm) {
      updateGoalForm = req.session.updateGoalForm
    } else {
      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)
      if (actionPlan.problemRetrievingData) {
        return next(createError(500, `Error retrieving plan for prisoner ${prisonNumber}`))
      }

      const goalToUpdate = actionPlan.goals.find(goal => goal.goalReference === goalReference)
      if (!goalToUpdate) {
        return next(createError(404, `Goal ${goalReference} does not exist in the prisoner's plan`))
      }

      updateGoalForm = toUpdateGoalForm(goalToUpdate)
    }

    req.session.updateGoalForm = undefined

    const view = new UpdateGoalView(prisonerSummary, updateGoalForm, req.flash('errors'))
    return res.render('pages/goal/update/index', { ...view.renderArgs })
  }

  submitUpdateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const updateGoalForm: UpdateGoalForm = { ...req.body }
    req.session.updateGoalForm = updateGoalForm

    const errors = validateUpdateGoalForm(updateGoalForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/update`)
    }

    // Redirect to the desired page based on the form action
    if (updateGoalForm.action === 'add-another-step') {
      // Initialize a new UpdateStepForm with the next step number
      const currentHighestStepNumber = Math.max(...updateGoalForm.steps.map(step => step.stepNumber))
      const nextStepNumber = currentHighestStepNumber + 1
      const newStep: UpdateStepForm = { stepNumber: nextStepNumber, status: 'NOT_STARTED' }
      updateGoalForm.steps.push(newStep)
      // Redirect back to the Update Goal page with named anchor taking the user straight to the new step
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/update#steps[${nextStepNumber - 1}][title]`)
    }

    return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/update/review`)
  }

  getReviewUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = req.session
    const { updateGoalForm } = req.session

    const view = new ReviewUpdateGoalView(prisonerSummary, updateGoalForm)
    return res.render('pages/goal/update/review', { ...view.renderArgs })
  }

  submitReviewUpdateGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { updateGoalForm } = req.session
    req.session.updateGoalForm = undefined

    const { prisonId } = prisonerSummary
    const updateGoalDto = toUpdateGoalDto(updateGoalForm, prisonId)
    try {
      await this.educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, req.user.token)
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      return next(createError(500, `Error updating plan for prisoner ${prisonNumber}`))
    }
  }
}
