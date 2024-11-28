import type { CreatedActionPlanReview } from 'viewModels'
import type { CreateActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import toScheduledActionPlanReview from './scheduledActionPlanReviewMapper'

const toCreatedActionPlan = (
  createActionPlanReviewResponse: CreateActionPlanReviewResponse,
  prisonNamesById: Map<string, string>,
): CreatedActionPlanReview => ({
  wasLastReviewBeforeRelease: createActionPlanReviewResponse.wasLastReviewBeforeRelease,
  latestReviewSchedule: toScheduledActionPlanReview(
    createActionPlanReviewResponse.latestReviewSchedule,
    prisonNamesById,
  ),
})

export default toCreatedActionPlan
