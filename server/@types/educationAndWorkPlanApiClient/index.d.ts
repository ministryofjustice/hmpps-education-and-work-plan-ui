declare module 'educationAndWorkPlanApiClient' {
  import { components } from '../educationAndWorkPlanApi'

  export type CreateGoalRequest = components['schemas']['CreateGoalRequest']
  export type CreateGoalsRequest = components['schemas']['CreateGoalsRequest']
  export type CreateStepRequest = components['schemas']['CreateStepRequest']

  export type UpdateGoalRequest = components['schemas']['UpdateGoalRequest']
  export type UpdateStepRequest = components['schemas']['UpdateStepRequest']

  export type ActionPlanResponse = components['schemas']['ActionPlanResponse']
  export type GoalResponse = components['schemas']['GoalResponse']
  export type StepResponse = components['schemas']['StepResponse']

  export type ActionPlanSummaryResponse = components['schemas']['ActionPlanSummaryResponse']
  export type ActionPlanSummaryListResponse = components['schemas']['ActionPlanSummaryListResponse']
  export type GetActionPlanSummariesRequest = components['schemas']['GetActionPlanSummariesRequest']

  export type TimelineResponse = components['schemas']['TimelineResponse']
  export type TimelineEventResponse = components['schemas']['TimelineEventResponse']
}
