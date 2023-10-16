import type { ActionPlanSummaryResponse } from 'educationAndWorkPlanApiClient'

export default function aValidActionPlanSummaryResponse(options?: {
  reference?: string
  prisonNumber?: string
  reviewDate?: string
}): ActionPlanSummaryResponse {
  return {
    reference: options?.reference || 'a3d3513a-71f2-4da7-9956-aa1316c7fa2b',
    prisonNumber: options?.prisonNumber || 'A1234BC',
    reviewDate: options?.reviewDate || '2025-02-15',
  }
}
