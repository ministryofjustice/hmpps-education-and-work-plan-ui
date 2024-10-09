import type { LearnerEductionPagedResponse, LearnerProfile } from 'curiousApiClient'
import RestClient from './restClient'
import config from '../config'

export default class CuriousClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Curious API Client', config.apis.curious, token)
  }

  async getLearnerProfile(prisonNumber: string, token: string): Promise<Array<LearnerProfile>> {
    return CuriousClient.restClient(token).get<Array<LearnerProfile>>({
      path: `/learnerProfile/${prisonNumber}`,
    })
  }

  async getLearnerEducationPage(prisonNumber: string, token: string, page = 0): Promise<LearnerEductionPagedResponse> {
    return CuriousClient.restClient(token).get<LearnerEductionPagedResponse>({
      path: `/learnerEducation/${prisonNumber}`,
      query: {
        page,
      },
    })
  }
}
