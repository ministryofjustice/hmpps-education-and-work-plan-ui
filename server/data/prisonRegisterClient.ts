import type { PrisonResponse } from 'prisonRegisterApiClient'
import RestClient from './restClient'
import config from '../config'

export default class PrisonRegisterClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Prison Register API Client', config.apis.prisonRegister, token)
  }

  async getPrisonByPrisonId(prisonId: string, token: string): Promise<PrisonResponse> {
    return PrisonRegisterClient.restClient(token).get({
      path: `/prisons/id/${prisonId}`,
    })
  }

  async getAllPrisons(token: string): Promise<Array<PrisonResponse>> {
    const allPrisonResponses = PrisonRegisterClient.restClient(token).get({
      path: '/prisons',
    })
    return allPrisonResponses as Promise<Array<PrisonResponse>>
  }
}
