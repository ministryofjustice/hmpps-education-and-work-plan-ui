import type { SessionsSummary } from 'viewModels'
import type { SessionSummaryResponse } from 'educationAndWorkPlanApiClient'

const toSessionsSummary = (sessionSummaryResponse: SessionSummaryResponse): SessionsSummary => {
  if (sessionSummaryResponse) {
    return {
      overdueSessionCount: sessionSummaryResponse.overdueInductions + sessionSummaryResponse.overdueReviews,
      dueSessionCount: sessionSummaryResponse.dueInductions + sessionSummaryResponse.dueReviews,
      onHoldSessionCount: sessionSummaryResponse.exemptInductions + sessionSummaryResponse.exemptReviews,
      problemRetrievingData: false,
    }
  }
  return { problemRetrievingData: true } as SessionsSummary
}

export default toSessionsSummary
