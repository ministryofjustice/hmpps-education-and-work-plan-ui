import type { CiagInduction } from 'ciagInductionApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CiagInductionClient {
  private static restClient(token: string): RestClient {
    return new RestClient('CIAG Induction API Client', config.apis.ciagInduction, token)
  }

  async getCiagInduction(prisonNumber: string, token: string): Promise<Array<CiagInduction>> {
    const learnerProfiles = CiagInductionClient.restClient(token).get({
      path: `/ciag/${prisonNumber}`,
    })
    return learnerProfiles as Promise<Array<CiagInduction>>
  }
}
