import type { LearnerNeurodivergence, LearnerProfile } from 'curiousApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CuriousClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Curious API Client', config.apis.curious, token)
  }

  async getLearnerProfile(prisonNumber: string, establishmentId: string, token: string): Promise<LearnerProfile> {
    const learnerProfiles = (await CuriousClient.restClient(token).get({
      path: `/learnerProfile/${prisonNumber}`,
      query: `establishmentId=${establishmentId}`,
    })) as Array<LearnerProfile>
    return learnerProfiles.pop()
  }

  async getLearnerNeurodivergence(
    prisonNumber: string,
    establishmentId: string,
    token: string,
  ): Promise<LearnerNeurodivergence> {
    const learnerNeurodivergence = (await CuriousClient.restClient(token).get({
      path: `/learnerNeurodivergence/${prisonNumber}`,
      query: `establishmentId=${establishmentId}`,
    })) as Array<LearnerNeurodivergence>
    return learnerNeurodivergence.pop()
  }
}
