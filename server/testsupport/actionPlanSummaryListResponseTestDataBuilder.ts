import type { ActionPlanSummaryResponse, ActionPlanSummaryListResponse } from 'educationAndWorkPlanApiClient'
import aValidActionPlanSummaryResponse from './actionPlanSummaryResponseTestDataBuilder'

export default function aValidActionPlanSummaryListResponse(options?: {
  actionPlanSummaries?: ActionPlanSummaryResponse[]
}): ActionPlanSummaryListResponse {
  return {
    actionPlanSummaries: options?.actionPlanSummaries || aValidActionPlanSummaryResponse(),
  }
}
