import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { PrisonResponse } from 'prisonRegisterApiClient'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class PrisonRegisterClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prison Register API Client', config.apis.prisonRegister, logger, authenticationClient)
  }

  async getAllPrisons(username: string): Promise<Array<PrisonResponse>> {
    return this.get<Array<PrisonResponse>>(
      {
        path: '/prisons',
      },
      asSystem(username),
    )
  }
}
