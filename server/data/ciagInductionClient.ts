import type { CiagInduction, CiagInductionListResponse, CiagInductionListRequest } from 'ciagInductionApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CiagInductionClient {
  private static restClient(token: string): RestClient {
    return new RestClient('CIAG Induction API Client', config.apis.ciagInduction, token)
  }

  async getCiagInduction(prisonNumber: string, token: string): Promise<CiagInduction> {
    return CiagInductionClient.restClient(token).get({
      path: `/ciag/induction/${prisonNumber}`,
    })
  }

  async getCiagInductionsForPrisonNumbers(prisonNumbers: string[], token: string): Promise<CiagInductionListResponse> {
    const requestBody: CiagInductionListRequest = { offenderIds: prisonNumbers }
    return CiagInductionClient.restClient(token).post({
      path: '/ciag/induction/list',
      data: requestBody,
    })
  }
}
