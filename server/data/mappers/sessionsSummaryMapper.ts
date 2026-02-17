import type { SessionsSummary } from 'viewModels'
import type { SessionSummaryResponse } from 'educationAndWorkPlanApiClient'

const toSessionsSummary = (sessionSummaryResponse: SessionSummaryResponse): SessionsSummary => ({
  overdueSessionCount: sessionSummaryResponse.overdueInductions + sessionSummaryResponse.overdueReviews,
  dueSessionCount: sessionSummaryResponse.dueInductions + sessionSummaryResponse.dueReviews,
  onHoldSessionCount: sessionSummaryResponse.exemptInductions + sessionSummaryResponse.exemptReviews,
})

export default toSessionsSummary
