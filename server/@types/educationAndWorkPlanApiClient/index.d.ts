declare module 'educationAndWorkPlanApiClient' {
  import { components } from '../educationAndWorkPlanApi'

  export type CreateGoalRequest = components['schemas']['CreateGoalRequest']
  export type CreateStepRequest = components['schemas']['CreateStepRequest']

  export type UpdateGoalRequest = components['schemas']['UpdateGoalRequest']
  export type UpdateStepRequest = components['schemas']['UpdateStepRequest']

  export type ActionPlanResponse = components['schemas']['ActionPlanResponse']
  export type GoalResponse = components['schemas']['GoalResponse']
  export type StepResponse = components['schemas']['StepResponse']
}
