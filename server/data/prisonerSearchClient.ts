import type { PagedCollectionOfPrisoners, Prisoner } from 'prisonerSearchApiClient'
import RestClient from './restClient'
import config from '../config'

export default class PrisonerSearchClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search API Client', config.apis.prisonerSearch, token)
  }

  async getPrisonerByPrisonNumber(prisonNumber: string, token: string): Promise<Prisoner> {
    return PrisonerSearchClient.restClient(token).get<Prisoner>({
      path: `/prisoner/${prisonNumber}`,
    })
  }

  async getPrisonersByPrisonId(
    prisonId: string,
    page: number,
    pageSize: number,
    token: string,
  ): Promise<PagedCollectionOfPrisoners> {
    return PrisonerSearchClient.restClient(token).get<PagedCollectionOfPrisoners>({
      path: `/prisoner-search/prison/${prisonId}`,
      headers: {
        'content-type': 'application/json',
      },
      query: {
        page,
        size: pageSize,
      },
    })
  }
}
