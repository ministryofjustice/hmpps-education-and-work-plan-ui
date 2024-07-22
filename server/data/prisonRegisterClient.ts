import type { PrisonResponse } from 'prisonRegisterApiClient'
import RestClient from './restClient'
import config from '../config'

export default class PrisonRegisterClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prison Register API Client', config.apis.prisonRegister, token)
  }

  async getAllPrisons(token: string): Promise<Array<PrisonResponse>> {
    return PrisonRegisterClient.restClient(token).get<Array<PrisonResponse>>({
      path: '/prisons',
    })
  }
}
