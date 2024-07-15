import createError from 'http-errors'
import moment from 'moment'
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
      const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.username)
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

    const goalCreatedDate = moment(updateGoalForm.createdAt)
    const goalTargetCompletionDate = moment(updateGoalForm.originalTargetCompletionDate)
    const goalTargetCompletionDateOption = {
      value: goalTargetCompletionDate.format('YYYY-MM-DD'),
      text: `by ${goalTargetCompletionDate.format('D MMMM YYYY')} (goal created on ${goalCreatedDate.format(
        'D MMMM YYYY',
      )})`,
    }
    const view = new UpdateGoalView(prisonerSummary, updateGoalForm, goalTargetCompletionDateOption)
    return res.render('pages/goal/update/index', { ...view.renderArgs })
  }

  submitUpdateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const updateGoalForm: UpdateGoalForm = { ...req.body }
    req.session.updateGoalForm = updateGoalForm

    // Remove the desired step on the action delete step
    if (updateGoalForm.action && updateGoalForm.action.startsWith('delete-step-')) {
      // Get the step index in between the 2 characters [ ] from the action value
      const stepIndex = parseInt(updateGoalForm.action.match(/\[(.*?)\]/)[1], 10)
      // Remove the desired step from the array
      updateGoalForm.steps.splice(stepIndex, 1)
      // Re-sequence the step array so that all the step's stepNumber fields are sequential starting from 1
      updateGoalForm.steps.forEach((step, index) => {
        // TODO refactor to avoid param-reassign eslint rule
        // eslint-disable-next-line no-param-reassign
        step.stepNumber = index + 1
      })
      // Redirect back to the Update Goal page with named anchor taking the user to the edit and remove steps section
      return res.redirect(`/plan/${prisonNumber}/goals/${goalReference}/update#edit-and-remove-steps`)
    }

    const errors = validateUpdateGoalForm(updateGoalForm)
    if (errors.length > 0) {
      return res.redirectWithErrors(`/plan/${prisonNumber}/goals/${goalReference}/update`, errors)
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
    const { prisonId } = prisonerSummary

    const updateGoalDto = toUpdateGoalDto(updateGoalForm, prisonId)
    const view = new ReviewUpdateGoalView(prisonerSummary, updateGoalDto)
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
      await this.educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, req.user.username)
      return res.redirect(`/plan/${prisonNumber}/view/overview`)
    } catch (e) {
      return next(createError(500, `Error updating plan for prisoner ${prisonNumber}`))
    }
  }
}
