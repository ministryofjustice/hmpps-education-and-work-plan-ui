import type { ActionPlanResponse, GoalResponse, StepResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import dateComparator from '../../routes/dateComparator'

const toActionPlan = (actionPlanResponse: ActionPlanResponse, problemRetrievingData: boolean): ActionPlan => {
  const goalReferencesInCreationDateOrder = goalReferencesSortedByCreationDate(actionPlanResponse.goals)
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals: actionPlanResponse.goals.map((goal: GoalResponse) => {
      const goalSequenceNumber = goalReferencesInCreationDateOrder.indexOf(goal.goalReference) + 1
      return toGoal(goal, goalSequenceNumber)
    }),
    problemRetrievingData,
  }
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

/**
 * Sorts the goals by creation date descending in a non-destructive manner (function arg is pass by reference) and
 * returns an array of the goal reference numbers.
 */
const goalReferencesSortedByCreationDate = (goals: Array<GoalResponse>): Array<string> => {
  return [...goals]
    .sort(
      (left: GoalResponse, right: GoalResponse) => dateComparator(toDate(left.createdAt), toDate(right.createdAt)) * -1,
    )
    .map(goal => goal.goalReference)
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

export { toActionPlan, toGoal }
