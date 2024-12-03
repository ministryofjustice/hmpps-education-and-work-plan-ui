import type { ActionPlanReviews, CompletedActionPlanReview, ScheduledActionPlanReview } from 'viewModels'
import aValidScheduledActionPlanReview from './scheduledActionPlanReviewTestDataBuilder'
import aValidCompletedActionPlanReview from './completedActionPlanReviewTestDataBuilder'

const aValidActionPlanReviews = (options?: {
  completedReviews?: Array<CompletedActionPlanReview>
  latestReviewSchedule?: ScheduledActionPlanReview
  problemRetrievingData?: boolean
}): ActionPlanReviews => ({
  completedReviews: options?.completedReviews || [aValidCompletedActionPlanReview()],
  latestReviewSchedule: options?.latestReviewSchedule || aValidScheduledActionPlanReview(),
  problemRetrievingData: !options || options.problemRetrievingData == null ? false : options.problemRetrievingData,
})

export default aValidActionPlanReviews
