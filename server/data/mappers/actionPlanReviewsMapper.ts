import type { ActionPlanReviewsResponse, CompletedActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import type { ActionPlanReviews } from 'viewModels'
import toScheduledActionPlanReview from './scheduledActionPlanReviewMapper'
import toCompletedActionPlanReview from './completedActionPlanReviewMapper'

const toActionPlanReviews = (
  actionPlanReviewsResponse: ActionPlanReviewsResponse,
  prisonNamesById: Map<string, string>,
): ActionPlanReviews => ({
  latestReviewSchedule: toScheduledActionPlanReview(actionPlanReviewsResponse.latestReviewSchedule, prisonNamesById),
  completedReviews: actionPlanReviewsResponse.completedReviews.map(
    (completedReview: CompletedActionPlanReviewResponse) =>
      toCompletedActionPlanReview(completedReview, prisonNamesById),
  ),
  problemRetrievingData: false,
})

export default toActionPlanReviews
