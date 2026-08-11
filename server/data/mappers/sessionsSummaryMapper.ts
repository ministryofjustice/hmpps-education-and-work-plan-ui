import type { SessionsSummary } from 'viewModels'
import type { SessionSummaryResponse } from 'educationAndWorkPlanApiClient'

const toSessionsSummary = (sessionSummaryResponse: SessionSummaryResponse): SessionsSummary => ({
  overdueSessionCount: sessionSummaryResponse.overdueInductions + sessionSummaryResponse.overdueReviews,
  dueSessionCount: sessionSummaryResponse.dueInductions + sessionSummaryResponse.dueReviews,
  onHoldSessionCount: sessionSummaryResponse.exemptInductions + sessionSummaryResponse.exemptReviews,
  // Screener pending only ever applies to Inductions, so there is no Reviews counterpart to add here.
  // Defaulted because the field is optional on the API response - a UI deployed ahead of the API would
  // otherwise render `undefined` in the summary card.
  screenerPendingCount: sessionSummaryResponse.screenerPendingInductions ?? 0,
})

export default toSessionsSummary
