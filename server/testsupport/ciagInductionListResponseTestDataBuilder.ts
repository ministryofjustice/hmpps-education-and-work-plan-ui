import type { CiagInductionSummaryListResponse, CiagInductionSummaryResponse } from 'educationAndWorkPlanApiClient'
import { aLongQuestionSetCiagInduction } from './ciagInductionTestDataBuilder'

export default function aValidCiagInductionListResponse(options?: {
  ciagProfileList?: CiagInductionSummaryResponse[]
}): CiagInductionSummaryListResponse {
  return {
    ciagProfileList: options?.ciagProfileList || [aLongQuestionSetCiagInduction()],
  }
}
