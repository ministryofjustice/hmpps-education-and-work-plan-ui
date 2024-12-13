declare module 'educationAndWorkPlanApiClient' {
  import { components } from '../educationAndWorkPlanApi'

  export type CreateActionPlanRequest = components['schemas']['CreateActionPlanRequest']

  export type CreateGoalRequest = components['schemas']['CreateGoalRequest']
  export type CreateGoalsRequest = components['schemas']['CreateGoalsRequest']
  export type CreateStepRequest = components['schemas']['CreateStepRequest']

  export type UpdateGoalRequest = components['schemas']['UpdateGoalRequest']
  export type UpdateStepRequest = components['schemas']['UpdateStepRequest']

  export type ArchiveGoalRequest = components['schemas']['ArchiveGoalRequest']
  export type UnarchiveGoalRequest = components['schemas']['UnarchiveGoalRequest']
  export type CompleteGoalRequest = components['schemas']['CompleteGoalRequest']

  export type ActionPlanResponse = components['schemas']['ActionPlanResponse']
  export type GoalResponse = components['schemas']['GoalResponse']
  export type StepResponse = components['schemas']['StepResponse']
  export type NoteResponse = components['schemas']['NoteResponse']
  export type GetGoalsResponse = components['schemas']['GetGoalsResponse']

  export type ActionPlanSummaryResponse = components['schemas']['ActionPlanSummaryResponse']
  export type ActionPlanSummaryListResponse = components['schemas']['ActionPlanSummaryListResponse']
  export type GetActionPlanSummariesRequest = components['schemas']['GetActionPlanSummariesRequest']

  export type TimelineResponse = components['schemas']['TimelineResponse']
  export type TimelineEventResponse = components['schemas']['TimelineEventResponse']

  export type InductionResponse = components['schemas']['InductionResponse']
  export type AchievedQualificationResponse = components['schemas']['AchievedQualificationResponse']
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

  export type EducationResponse = components['schemas']['EducationResponse']
  export type CreateEducationRequest = components['schemas']['CreateEducationRequest']
  export type CreateAchievedQualificationRequest = components['schemas']['CreateAchievedQualificationRequest']
  export type UpdateEducationRequest = components['schemas']['UpdateEducationRequest']
  export type CreateOrUpdateAchievedQualificationRequest =
    components['schemas']['CreateOrUpdateAchievedQualificationRequest']

  export type CreateActionPlanReviewRequest = components['schemas']['CreateActionPlanReviewRequest']
  export type CreateActionPlanReviewResponse = components['schemas']['CreateActionPlanReviewResponse']
  export type ActionPlanReviewsResponse = components['schemas']['ActionPlanReviewsResponse']
  export type ScheduledActionPlanReviewResponse = components['schemas']['ScheduledActionPlanReviewResponse']
  export type CompletedActionPlanReviewResponse = components['schemas']['CompletedActionPlanReviewResponse']
  export type UpdateReviewScheduleStatusRequest = components['schemas']['UpdateReviewScheduleStatusRequest']

  export type InductionScheduleResponse = components['schemas']['InductionScheduleResponse']
}
