import type {
  ActionPlanReviewsResponse,
  CompletedActionPlanReviewResponse,
  ScheduledActionPlanReviewResponse,
} from 'educationAndWorkPlanApiClient'
import aValidScheduledActionPlanReviewResponse from './scheduledActionPlanReviewResponseTestDataBuilder'
import aValidCompletedActionPlanReviewResponse from './completedActionPlanReviewResponseTestDataBuilder'

const aValidActionPlanReviewsResponse = (options?: {
  latestReviewSchedule?: ScheduledActionPlanReviewResponse
  completedReviews?: Array<CompletedActionPlanReviewResponse>
}): ActionPlanReviewsResponse => ({
  latestReviewSchedule: options?.latestReviewSchedule || aValidScheduledActionPlanReviewResponse(),
  completedReviews: options?.completedReviews || [aValidCompletedActionPlanReviewResponse()],
})

export default aValidActionPlanReviewsResponse
