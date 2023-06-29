import type { Prisoner } from 'prisonRegisterApiClient'
import RestClient from './restClient'
import config from '../config'

export default class PrisonerSearchClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search API Client', config.apis.prisonerSearch, token)
  }

  async getPrisonerByPrisonNumber(prisonNumber: string, token: string): Promise<Prisoner> {
    return PrisonerSearchClient.restClient(token).get({
      path: `/prisoner/${prisonNumber}`,
    })
  }
}
