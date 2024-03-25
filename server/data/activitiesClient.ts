import type {
  PrisonersAllocationsRequest,
  PrisonersAllocationsResponse,
  WaitingListSearchRequest,
  WaitingListSearchRequestQueryParams,
  WaitingListSearchResponse,
} from 'activitiesApiClient'
import RestClient from './restClient'
import config from '../config'

export default class ActivitiesClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Activities API Client', config.apis.activities, token)
  }

  async getAllocationsByPrisonNumbers(
    prisonNumbers: string[],
    prisonId: string,
    token: string,
  ): Promise<PrisonersAllocationsResponse> {
    const requestBody: PrisonersAllocationsRequest = prisonNumbers
    return ActivitiesClient.restClient(token).post<PrisonersAllocationsResponse>({
      headers: { 'Caseload-Id': prisonId },
      path: `/prisons/${prisonId}/prisoner-allocations`,
      data: requestBody,
    })
  }

  async searchWaitingLists(
    request: WaitingListSearchRequest,
    query: WaitingListSearchRequestQueryParams,
    prisonId: string,
    token: string,
  ): Promise<WaitingListSearchResponse> {
    return ActivitiesClient.restClient(token).post<WaitingListSearchResponse>({
      headers: { 'Caseload-Id': prisonId },
      path: `/waiting-list-applications/${prisonId}/search`,
      query,
      data: request,
    })
  }
}
