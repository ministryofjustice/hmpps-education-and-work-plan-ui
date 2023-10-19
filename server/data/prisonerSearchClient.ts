import type { PagedCollectionOfPrisoners, Prisoner } from 'prisonRegisterApiClient'
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

  async getPrisonersByPrisonId(
    prisonId: string,
    page: number,
    pageSize: number,
    token: string,
  ): Promise<PagedCollectionOfPrisoners> {
    return PrisonerSearchClient.restClient(token).get({
      path: `/prisoner-search/prison/${prisonId}`,
      headers: {
        'content-type': 'application/json',
      },
      query: {
        page: `${page}`, // coerce `page` (which is a `number`) into a `string` because query string param values are all strings.
        size: `${pageSize}`, // coerce `pageSize` (which is a `number`) into a `string` because query string param values are all strings.
      },
    })
  }
}
