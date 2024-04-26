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

  export type InductionResponse = components['schemas']['InductionResponse']
  export type PersonalSkill = components['schemas']['PersonalSkill']
  export type PersonalInterest = components['schemas']['PersonalInterest']
  export type FutureWorkInterest = components['schemas']['FutureWorkInterest']
  export type PreviousWorkExperience = components['schemas']['PreviousWorkExperience']
  export type InPrisonWorkInterest = components['schemas']['InPrisonWorkInterest']
  export type AchievedQualification = components['schemas']['AchievedQualification']
  export type InPrisonTrainingInterest = components['schemas']['InPrisonTrainingInterest']

  export type CreateInductionRequest = components['schemas']['CreateInductionRequest']
  export type UpdateInductionRequest = components['schemas']['UpdateInductionRequest']

  export type GetCiagInductionSummariesRequest = components['schemas']['GetCiagInductionSummariesRequest']
  export type CiagInductionSummaryListResponse = components['schemas']['CiagInductionSummaryListResponse']
  export type CiagInductionSummaryResponse = components['schemas']['CiagInductionSummaryResponse']
}
