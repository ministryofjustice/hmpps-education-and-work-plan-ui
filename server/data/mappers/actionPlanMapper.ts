import type { ActionPlanResponse, GoalResponse, StepResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlanDto, GoalDto, StepDto } from 'dto'

const toActionPlanDto = (actionPlanResponse: ActionPlanResponse): ActionPlanDto => {
  return {
    prisonNumber: actionPlanResponse.prisonNumber,
    goals: actionPlanResponse.goals.map((goal: GoalResponse) => toGoalDto(goal)),
  }
}

const toGoalDto = (goalResponse: GoalResponse): GoalDto => {
  return {
    goalReference: goalResponse.goalReference,
    title: goalResponse.title,
    status: goalResponse.status,
    steps: goalResponse.steps.map((step: StepResponse) => toStepDto(step)),
    createdBy: goalResponse.createdBy,
    createdByDisplayName: goalResponse.createdByDisplayName,
    createdAt: goalResponse.createdAt,
    updatedBy: goalResponse.updatedBy,
    updatedByDisplayName: goalResponse.updatedByDisplayName,
    updatedAt: goalResponse.updatedAt,
    reviewDate: goalResponse.reviewDate,
    note: goalResponse.notes,
  }
}

const toStepDto = (stepResponse: StepResponse): StepDto => {
  return {
    stepReference: stepResponse.stepReference,
    title: stepResponse.title,
    targetDateRange: stepResponse.targetDateRange,
    status: stepResponse.status,
    sequenceNumber: stepResponse.sequenceNumber,
  }
}

export { toActionPlanDto, toGoalDto, toStepDto }
