import type { WaitingListSearchRequest } from 'activitiesApiClient'
import nock from 'nock'
import config from '../config'
import ActivitiesClient from './activitiesClient'
import { aValidPrisonersAllocationsResponse } from '../testsupport/activitiesApi/allocationTestDataBuilder'
import aValidWaitingListApplication from '../testsupport/activitiesApi/waitingListTestDataBuilder'

describe('ActivitiesClient', () => {
  const activitiesClient = new ActivitiesClient()

  config.apis.activities.url = 'http://localhost:8200'
  let activitesApi: nock.Scope

  beforeEach(() => {
    activitesApi = nock(config.apis.activities.url)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getAllocationsByPrisonNumbers', () => {
    it('should get prisoners allocations', async () => {
      // Given
      const prisonId = 'MDI'
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const systemToken = 'a-system-token'

      const expectedResponseBody = aValidPrisonersAllocationsResponse(prisonNumbers.map(p => ({ prisonNumber: p })))
      activitesApi.post(`/prisons/${prisonId}/prisoner-allocations`, prisonNumbers).reply(200, expectedResponseBody)

      // When
      const actual = await activitiesClient.getAllocationsByPrisonNumbers(prisonNumbers, prisonId, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
    })
  })

  describe('searchWaitlists', () => {
    it('should get waiting list applications', async () => {
      // Given
      const prisonId = 'MDI'
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const systemToken = 'a-system-token'

      const waitingListSearchRequest: WaitingListSearchRequest = { prisonerNumbers: prisonNumbers }
      const query = {}
      const expectedResponseBody = aValidWaitingListApplication()
      activitesApi
        .post(`/waiting-list-applications/${prisonId}/search`, waitingListSearchRequest)
        .reply(200, expectedResponseBody)

      // When
      const actual = await activitiesClient.searchWaitingLists(waitingListSearchRequest, query, prisonId, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
    })

    it('should be able to request a page of waiting list applications', async () => {
      // Given
      const prisonId = 'MDI'
      const prisonNumbers = ['A1234BC', 'B5544GD']
      const systemToken = 'a-system-token'

      const waitingListSearchRequest: WaitingListSearchRequest = { prisonerNumbers: prisonNumbers }
      const query = {
        page: 2,
        pageSize: 10,
      }
      const expectedResponseBody = aValidWaitingListApplication()
      activitesApi
        .post(`/waiting-list-applications/${prisonId}/search?pageSize=10&page=2`, waitingListSearchRequest)
        .reply(200, expectedResponseBody)

      // When
      const actual = await activitiesClient.searchWaitingLists(waitingListSearchRequest, query, prisonId, systemToken)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedResponseBody)
    })
  })
})
