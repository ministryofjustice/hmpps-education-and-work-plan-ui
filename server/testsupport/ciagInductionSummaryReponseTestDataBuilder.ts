import type { CiagInductionSummaryResponse } from 'educationAndWorkPlanApiClient'

const aValidCiagInductionSummaryResponse = (options?: {
  prisonNumber?: string
  hopingToGetWork?: 'YES' | 'NO' | 'NOT_SURE'
  createdBy?: string
  createdDateTime?: string
  modifiedBy?: string
  modifiedDateTime?: string
}): CiagInductionSummaryResponse => {
  return {
    offenderId: options?.prisonNumber || 'A1234BC',
    desireToWork: options?.hopingToGetWork === 'YES',
    hopingToGetWork: options?.hopingToGetWork || 'NO',
    createdBy: options?.createdBy || 'DPS_USER_GEN',
    createdDateTime: options?.createdDateTime || '2023-08-15T14:47:09.123Z',
    modifiedBy: options?.modifiedBy || 'ANOTHER_DPS_USER_GEN',
    modifiedDateTime: options?.modifiedDateTime || '2023-08-22T11:12:31.943Z',
  }
}

export default aValidCiagInductionSummaryResponse
