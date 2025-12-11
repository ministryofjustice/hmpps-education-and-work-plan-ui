import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { PagedCollectionOfPrisoners, Prisoner } from 'prisonerSearchApiClient'
import config from '../config'
import logger from '../../logger'
import restClientErrorHandler from './restClientErrorHandler'

export default class PrisonerSearchClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prisoner Search API Client', config.apis.prisonerSearch, logger, authenticationClient)
  }

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<Prisoner> {
    return this.get<Prisoner>(
      {
        path: `/prisoner/${prisonNumber}`,
      },
      asSystem(username),
    )
  }

  async getPrisonersByPrisonId(
    prisonId: string,
    page: number,
    pageSize: number,
    username: string,
  ): Promise<PagedCollectionOfPrisoners> {
    return this.get<PagedCollectionOfPrisoners>(
      {
        path: `/prisoner-search/prison/${prisonId}`,
        headers: {
          'content-type': 'application/json',
        },
        query: {
          page,
          size: pageSize,
          responseFields: [
            'prisonerNumber',
            'prisonId',
            'releaseDate',
            'firstName',
            'lastName',
            'receptionDate',
            'dateOfBirth',
            'cellLocation',
            'restrictedPatient',
            'supportingPrisonId',
          ],
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
