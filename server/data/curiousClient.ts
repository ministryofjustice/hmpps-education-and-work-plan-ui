import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { LearnerEducationPagedResponse, LearnerProfile } from 'curiousApiClient'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import restClientErrorHandler from './restClientErrorHandler'
import config from '../config'
import logger from '../../logger'

export default class CuriousClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Curious API Client', config.apis.curious, logger, authenticationClient)
  }

  async getLearnerProfile(prisonNumber: string): Promise<Array<LearnerProfile>> {
    return this.get<Array<LearnerProfile>>(
      {
        path: `/learnerProfile/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem('CURIOUS_API'),
    )
  }

  async getLearnerEducationPage(prisonNumber: string, page = 0): Promise<LearnerEducationPagedResponse> {
    return this.get<LearnerEducationPagedResponse>(
      {
        path: `/learnerEducation/${prisonNumber}`,
        query: {
          page,
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem('CURIOUS_API'),
    )
  }
}
