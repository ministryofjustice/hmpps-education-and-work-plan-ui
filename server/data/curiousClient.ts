import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CuriousClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Curious API Client', config.apis.curious, token)
  }

  async getLearnerProfile(prisonNumber: string, token: string): Promise<Array<LearnerProfile>> {
    const learnerProfiles = (await CuriousClient.restClient(token).get({
      path: `/learnerProfile/${prisonNumber}`,
    })) as Promise<Array<LearnerProfile>>
    return learnerProfiles
  }

  async getLearnerNeurodivergence(prisonNumber: string, token: string): Promise<Array<LearnerNeurodivergence>> {
    const learnerNeurodivergence = (await CuriousClient.restClient(token).get({
      path: `/learnerNeurodivergence/${prisonNumber}`,
    })) as Promise<Array<LearnerNeurodivergence>>
    return learnerNeurodivergence
  }
}
