import type { CreatedActionPlan } from 'viewModels'
import type { CreateActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import toScheduledActionPlanReview from './scheduledActionPlanReviewMapper'

const toCreatedActionPlan = (
  createActionPlanReviewResponse: CreateActionPlanReviewResponse,
  prisonNamesById: Map<string, string>,
): CreatedActionPlan => ({
  wasLastReviewBeforeRelease: createActionPlanReviewResponse.wasLastReviewBeforeRelease,
  latestReviewSchedule: toScheduledActionPlanReview(
    createActionPlanReviewResponse.latestReviewSchedule,
    prisonNamesById,
  ),
})

export default toCreatedActionPlan
