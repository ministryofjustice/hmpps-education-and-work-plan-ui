import type { ActionPlanResponse, GoalResponse, StepResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlan, Goal, Step } from 'viewModels'
import moment from 'moment'

const toActionPlan = (actionPlanResponse: ActionPlanResponse, problemRetrievingData: boolean): ActionPlan => {
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals: actionPlanResponse.goals.map((goal: GoalResponse) => toGoal(goal)),
    problemRetrievingData,
  }
}

const toGoal = (goalResponse: GoalResponse): Goal => {
  return {
    goalReference: goalResponse.goalReference,
    title: goalResponse.title,
    status: goalResponse.status,
    steps: goalResponse.steps.map((step: StepResponse) => toStep(step)),
    createdBy: goalResponse.createdBy,
    createdByDisplayName: goalResponse.createdByDisplayName,
    createdAt: goalResponse.createdAt,
    updatedBy: goalResponse.updatedBy,
    updatedByDisplayName: goalResponse.updatedByDisplayName,
    updatedAt: goalResponse.updatedAt,
    targetCompletionDate: toDate(goalResponse.targetCompletionDate),
    note: goalResponse.notes,
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
  return dateString ? moment(dateString).toDate() : null
}

export { toActionPlan, toGoal }
