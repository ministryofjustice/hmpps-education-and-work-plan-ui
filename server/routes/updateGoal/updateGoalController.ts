import createError from 'http-errors'
import { format, parseISO, startOfDay } from 'date-fns'
import type { Request, RequestHandler } from 'express'
import type { UpdateGoalForm, UpdateStepForm } from 'forms'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalView from './updateGoalView'
import ReviewUpdateGoalView from './reviewUpdateGoalView'
import { toUpdateGoalForm } from './mappers/goalToUpdateGoalFormMapper'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { toUpdateGoalDto } from './mappers/updateGoalFormToUpdateGoalDtoMapper'
import { AuditService } from '../../services'
import { BaseAuditData } from '../../services/auditService'
import getPrisonerContext from '../../data/session/prisonerContexts'

export default class UpdateGoalController {
  constructor(
    private readonly educationAndWorkPlanService: EducationAndWorkPlanService,
    private readonly auditService: AuditService,
  ) {}

  getUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    let updateGoalForm: UpdateGoalForm
    if (getPrisonerContext(req.session, prisonNumber).updateGoalForm) {
      updateGoalForm = getPrisonerContext(req.session, prisonNumber).updateGoalForm
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

    getPrisonerContext(req.session, prisonNumber).updateGoalForm = undefined

    const goalCreatedDate = startOfDay(parseISO(updateGoalForm.createdAt))
    const goalTargetCompletionDate = startOfDay(parseISO(updateGoalForm.originalTargetCompletionDate))
    const goalTargetCompletionDateOption = {
      value: format(goalTargetCompletionDate, 'yyyy-MM-dd'),
      text: `by ${format(goalTargetCompletionDate, 'd MMMM yyyy')} (goal created on ${format(goalCreatedDate, 'd MMMM yyyy')})`,
    }
    const view = new UpdateGoalView(prisonerSummary, updateGoalForm, goalTargetCompletionDateOption)
    return res.render('pages/goal/update/index', { ...view.renderArgs })
  }

  submitUpdateGoalForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const updateGoalForm: UpdateGoalForm = { ...req.body }
    getPrisonerContext(req.session, prisonNumber).updateGoalForm = updateGoalForm

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
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { updateGoalForm } = getPrisonerContext(req.session, prisonNumber)
    const { prisonId } = prisonerSummary

    const updateGoalDto = toUpdateGoalDto(updateGoalForm, prisonId)
    const view = new ReviewUpdateGoalView(prisonerSummary, updateGoalDto)
    return res.render('pages/goal/update/review', { ...view.renderArgs })
  }

  submitReviewUpdateGoal: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { updateGoalForm } = getPrisonerContext(req.session, prisonNumber)

    getPrisonerContext(req.session, prisonNumber).updateGoalForm = undefined

    const { prisonId } = prisonerSummary
    const updateGoalDto = toUpdateGoalDto(updateGoalForm, prisonId)
    try {
      await this.educationAndWorkPlanService.updateGoal(prisonNumber, updateGoalDto, req.user.token)
    } catch (e) {
      return next(createError(500, `Error updating plan for prisoner ${prisonNumber}`))
    }

    this.auditService.logUpdateGoal(updateGoalAuditData(req)) // no need to wait for response
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}

const updateGoalAuditData = (req: Request): BaseAuditData => {
  const { prisonNumber, goalReference } = req.params
  return {
    details: { goalReference },
    subjectType: 'PRISONER_ID',
    subjectId: prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
