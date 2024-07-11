import type { ActionPlanResponse, GetGoalsResponse, GoalResponse, StepResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import dateComparator from '../../routes/dateComparator'

const toActionPlan = (actionPlanResponse: ActionPlanResponse, problemRetrievingData: boolean): ActionPlan => {
  const goals = toOrderedGoals(actionPlanResponse.goals)
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals,
    problemRetrievingData,
  }
}

const toGoals = (response: GetGoalsResponse): Goal[] => {
  return toOrderedGoals(response.goals)
}

/**
 * Sets a goal sequence by creation date (oldest = 1) and returns them in creation order (newest first)
 */
function toOrderedGoals(goals: GoalResponse[]): Goal[] {
  return [...goals]
    .sort((left: GoalResponse, right: GoalResponse) =>
      dateComparator(toDate(left.createdAt), toDate(right.createdAt), 'ASC'),
    )
    .map((goal, index) => toGoal(goal, index + 1))
    .reverse()
}

const toGoal = (goalResponse: GoalResponse, goalSequenceNumber: number): Goal => {
  return {
    goalReference: goalResponse.goalReference,
    title: goalResponse.title,
    status: goalResponse.status,
    steps: goalResponse.steps.map((step: StepResponse) => toStep(step)),
    createdBy: goalResponse.createdBy,
    createdByDisplayName: goalResponse.createdByDisplayName,
    createdAt: toDate(goalResponse.createdAt),
    updatedBy: goalResponse.updatedBy,
    updatedByDisplayName: goalResponse.updatedByDisplayName,
    updatedAt: toDate(goalResponse.updatedAt),
    targetCompletionDate: toDate(goalResponse.targetCompletionDate),
    note: goalResponse.notes,
    sequenceNumber: goalSequenceNumber,
  }
}

const toStep = (stepResponse: StepResponse): Step => {
  return {
    stepReference: stepResponse.stepReference,
    title: stepResponse.title,
    status: stepResponse.status,
    sequenceNumber: stepResponse.sequenceNumber,
  }
}

const toDate = (dateString: string): Date => {
  return dateString ? new Date(dateString) : null
}

export { toActionPlan, toGoal, toGoals }
