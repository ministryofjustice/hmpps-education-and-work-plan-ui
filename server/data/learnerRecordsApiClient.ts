import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { LearnerEventsResponse } from 'learnerRecordsApiClient'
import config from '../config'
import logger from '../../logger'
import restClientErrorHandler from './restClientErrorHandler'

export default class LearnerRecordsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Learner Records API Client', config.apis.learnerRecordsApi, logger, authenticationClient)
  }

  async getLearnerEvents(prisonNumber: string, username: string): Promise<LearnerEventsResponse> {
    return this.get<LearnerEventsResponse>(
      {
        path: `/match/${prisonNumber}/learner-events`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
        headers: {
          'X-Username': username,
        },
      },
      asSystem(username),
    )
  }
}
