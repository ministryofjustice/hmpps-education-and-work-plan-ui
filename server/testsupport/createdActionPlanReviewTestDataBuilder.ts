import type { CreatedActionPlanReview, ScheduledActionPlanReview } from 'viewModels'
import aValidScheduledActionPlanReview from './scheduledActionPlanReviewTestDataBuilder'

const aValidCreatedActionPlanReview = (options?: {
  wasLastReviewBeforeRelease?: boolean
  latestReviewSchedule?: ScheduledActionPlanReview
}): CreatedActionPlanReview => ({
  wasLastReviewBeforeRelease:
    !options || options.wasLastReviewBeforeRelease === null || options.wasLastReviewBeforeRelease === undefined
      ? true
      : options.wasLastReviewBeforeRelease,
  latestReviewSchedule: options?.latestReviewSchedule || aValidScheduledActionPlanReview(),
})

export default aValidCreatedActionPlanReview
