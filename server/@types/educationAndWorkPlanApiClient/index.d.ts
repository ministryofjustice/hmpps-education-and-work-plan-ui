declare module 'educationAndWorkPlanApiClient' {
  import { components } from '../educationAndWorkPlanApi'

  export type CreateGoalRequest = components['schemas']['CreateGoalRequest']
  export type StepRequest = components['schemas']['StepRequest']

  export type ActionPlanResponse = components['schemas']['ActionPlanResponse']
  export type GoalResponse = components['schemas']['GoalResponse']
  export type StepResponse = components['schemas']['StepResponse']
}
