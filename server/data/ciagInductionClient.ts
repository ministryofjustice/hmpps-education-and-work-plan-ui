import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { CiagInductionSummaryListResponse, GetCiagInductionSummariesRequest } from 'educationAndWorkPlanApiClient'
import config from '../config'
import logger from '../../logger'

export default class CiagInductionClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('CIAG Induction API Client', config.apis.educationAndWorkPlan, logger, authenticationClient)
  }

  async getCiagInductionsForPrisonNumbers(
    prisonNumbers: string[],
    username: string,
  ): Promise<CiagInductionSummaryListResponse> {
    const requestBody: GetCiagInductionSummariesRequest = { offenderIds: prisonNumbers }
    return this.post<CiagInductionSummaryListResponse>(
      {
        path: '/ciag/induction/list',
        data: requestBody,
      },
      asSystem(username),
    )
  }
}
