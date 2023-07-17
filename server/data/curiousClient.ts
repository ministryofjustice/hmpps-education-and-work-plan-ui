import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CuriousClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Curious API Client', config.apis.curious, token)
  }

  async getPrisonerProfile(prisonNumber: string, token: string): Promise<Array<LearnerProfile>> {
    return (await CuriousClient.restClient(token).get({
      path: `/learnerProfile/${prisonNumber}`,
    })) as Promise<Array<LearnerProfile>>
  }

  async getPrisonerNeurodivergence(prisonNumber: string, token: string): Promise<Array<LearnerNeurodivergence>> {
    return (await CuriousClient.restClient(token).get({
      path: `/learnerNeurodivergence/${prisonNumber}`,
    })) as Promise<Array<LearnerNeurodivergence>>
  }
}
