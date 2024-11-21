import type { CreateActionPlanReviewResponse, ScheduledActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import aValidScheduledActionPlanReviewResponse from './scheduledActionPlanReviewResponseTestDataBuilder'

const aValidCreateActionPlanReviewResponse = (options?: {
  wasLastReviewBeforeRelease?: boolean
  latestReviewSchedule?: ScheduledActionPlanReviewResponse
}): CreateActionPlanReviewResponse => ({
  wasLastReviewBeforeRelease:
    !options || options.wasLastReviewBeforeRelease === null || options.wasLastReviewBeforeRelease === undefined
      ? true
      : options.wasLastReviewBeforeRelease,
  latestReviewSchedule: options?.latestReviewSchedule || aValidScheduledActionPlanReviewResponse(),
})

export default aValidCreateActionPlanReviewResponse
