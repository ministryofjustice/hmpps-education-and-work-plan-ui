import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import config from '../config'
import LearnerRecordsApiClient from './learnerRecordsApiClient'
import aLearnerEventsResponse from '../testsupport/learnerRecordsApi/learnerEventsResponseTestDataBuilder'

jest.mock('@ministryofjustice/hmpps-auth-clients')

describe('learnerRecordsApiClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'
  const prisonNumber = 'A1234BC'

  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
  const learnerRecordsApiClient = new LearnerRecordsApiClient(mockAuthenticationClient)

  const learnerRecordsApi = nock(config.apis.learnerRecordsApi.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getLearnerEvents', () => {
    it('should get learner events for a prisoner', async () => {
      // Given
      const expectedResponse = aLearnerEventsResponse()
      learnerRecordsApi
        .get(`/match/${prisonNumber}/learner-events`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .matchHeader('X-Username', username)
        .reply(200, expectedResponse)

      // When
      const actual = await learnerRecordsApiClient.getLearnerEvents(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should return null given API returns a not found error', async () => {
      // Given
      const apiErrorResponse = {
        status: 404,
        userMessage: 'Not found',
        developerMessage: 'Not found',
      }

      learnerRecordsApi
        .get(`/match/${prisonNumber}/learner-events`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .matchHeader('X-Username', username)
        .reply(404, apiErrorResponse)

      // When
      const actual = await learnerRecordsApiClient.getLearnerEvents(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      learnerRecordsApi
        .get(`/match/${prisonNumber}/learner-events`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .matchHeader('X-Username', username)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await learnerRecordsApiClient.getLearnerEvents(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
