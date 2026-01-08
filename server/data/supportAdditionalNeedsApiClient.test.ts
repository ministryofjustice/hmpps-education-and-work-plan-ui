import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'
import config from '../config'
import { aValidConditionListResponse } from '../testsupport/conditionResponseTestDataBuilder'
import { aValidAlnScreeners } from '../testsupport/alnScreenerResponseTestDataBuilder'
import { aValidSupportStrategyListResponse } from '../testsupport/supportStrategyResponseTestDataBuilder'
import { aValidChallengeListResponse } from '../testsupport/challengeResponseTestDataBuilder'
import { aValidStrengthListResponse } from '../testsupport/strengthResponseTestDataBuilder'

jest.mock('@ministryofjustice/hmpps-auth-clients')

describe('supportAdditionalNeedsApiClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'
  const prisonNumber = 'A1234BC'

  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(mockAuthenticationClient)

  config.apis.prisonerSearch.url = 'http://localhost:8200'
  const supportAdditionalNeedsApi = nock(config.apis.supportAdditionalNeedsApi.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getSupportStrategies', () => {
    it('should get support strategies for a prisoner', async () => {
      // Given
      const expectedResponse = aValidSupportStrategyListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getChallenges', () => {
    it('should get challenges for a prisoner', async () => {
      // Given
      const expectedResponse = aValidChallengeListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getStrengths', () => {
    it('should get strengths for a prisoner', async () => {
      // Given
      const expectedResponse = aValidStrengthListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getConditions', () => {
    it('should get conditions for a prisoner', async () => {
      // Given
      const expectedResponse = aValidConditionListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getAdditionalLearningNeedsScreeners', () => {
    it('should get a prisoners Additional Learning Needs screeners', async () => {
      // Given
      const expectedResponse = aValidAlnScreeners()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getAdditionalLearningNeedsScreeners(prisonNumber, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
