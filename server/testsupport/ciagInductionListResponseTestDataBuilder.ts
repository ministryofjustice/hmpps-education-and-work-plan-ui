import type { CiagInduction, CiagInductionListResponse } from 'ciagInductionApiClient'
import { aLongQuestionSetCiagInduction } from './ciagInductionTestDataBuilder'

export default function aValidCiagInductionListResponse(options?: {
  ciagProfileList?: CiagInduction[]
}): CiagInductionListResponse {
  return {
    ciagProfileList: options?.ciagProfileList || [aLongQuestionSetCiagInduction()],
  }
}
