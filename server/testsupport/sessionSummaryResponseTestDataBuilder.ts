import type { SessionSummaryResponse } from 'educationAndWorkPlanApiClient'

const aValidSessionSummaryResponse = (options?: {
  overdueReviews?: number
  overdueInductions?: number
  dueReviews?: number
  dueInductions?: number
  exemptReviews?: number
  exemptInductions?: number
}): SessionSummaryResponse => ({
  overdueReviews: options?.overdueReviews || 1,
  overdueInductions: options?.overdueInductions || 2,
  dueReviews: options?.dueReviews || 3,
  dueInductions: options?.dueInductions || 4,
  exemptReviews: options?.exemptReviews || 5,
  exemptInductions: options?.exemptInductions || 6,
})

export default aValidSessionSummaryResponse
