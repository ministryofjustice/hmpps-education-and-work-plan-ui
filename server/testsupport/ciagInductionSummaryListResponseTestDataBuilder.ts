import type { CiagInductionSummaryListResponse, CiagInductionSummaryResponse } from 'educationAndWorkPlanApiClient'
import aValidCiagInductionSummaryResponse from './ciagInductionSummaryReponseTestDataBuilder'

export default function aValidCiagInductionSummaryListResponse(options?: {
  ciagProfileList?: CiagInductionSummaryResponse[]
}): CiagInductionSummaryListResponse {
  return {
    ciagProfileList: options?.ciagProfileList || [aValidCiagInductionSummaryResponse()],
  }
}
