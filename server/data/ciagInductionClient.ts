import type { CiagInductionSummaryListResponse, GetCiagInductionSummariesRequest } from 'educationAndWorkPlanApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CiagInductionClient {
  private static restClient(token: string): RestClient {
    return new RestClient('CIAG Induction API Client', config.apis.educationAndWorkPlan, token)
  }

  async getCiagInductionsForPrisonNumbers(
    prisonNumbers: string[],
    token: string,
  ): Promise<CiagInductionSummaryListResponse> {
    const requestBody: GetCiagInductionSummariesRequest = { offenderIds: prisonNumbers }
    return CiagInductionClient.restClient(token).post({
      path: '/ciag/induction/list',
      data: requestBody,
    })
  }
}
