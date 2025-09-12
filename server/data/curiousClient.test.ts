import type { LearnerEducationPagedResponse } from 'curiousApiClient'
import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import CuriousClient from './curiousClient'
import config from '../config'
import { learnerEducationPagedResponsePage1Of1 } from '../testsupport/learnerEducationPagedResponseTestDataBuilder'
import { anAllAssessmentDTO } from '../testsupport/curiousAssessmentsTestDataBuilder'

describe('curiousClient', () => {
  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const curiousClient = new CuriousClient(mockAuthenticationClient)

  const prisonNumber = 'A1234BC'
  const systemToken = 'test-system-token'

  config.apis.curious.url = 'http://localhost:8200'
  const curiousApi = nock(config.apis.curious.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getLearnerEducationPage', () => {
    it('should get learner eduction page', async () => {
      // Given
      const page = 0

      const learnerEducationPage1Of1: LearnerEducationPagedResponse =
        learnerEducationPagedResponsePage1Of1(prisonNumber)
      curiousApi
        .get(`/learnerEducation/${prisonNumber}?page=${page}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, learnerEducationPage1Of1)

      // When
      const actual = await curiousClient.getLearnerEducationPage(prisonNumber, page)

      // Then
      expect(actual).toEqual(learnerEducationPage1Of1)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })

    it('should not get learner education page given the API returns a 404', async () => {
      // Given
      const page = 0

      const expectedResponseBody = {
        errorCode: 'VC4004',
        errorMessage: 'Not found',
        httpStatusCode: 404,
      }
      curiousApi
        .get(`/learnerEducation/${prisonNumber}?page=${page}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await curiousClient.getLearnerEducationPage(prisonNumber, page)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(actual).toBeNull()
    })

    it('should not get learner education page given the API returns an error response', async () => {
      // Given
      const page = 0

      const apiErrorResponse = {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      }
      curiousApi
        .get(`/learnerEducation/${prisonNumber}?page=${page}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(401, apiErrorResponse)

      const expectedError = new Error('Unauthorized')

      // When
      const actual = await curiousClient.getLearnerEducationPage(prisonNumber, page).catch(e => e)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
    })
  })

  describe('getAssessmentsByPrisonNumber', () => {
    it('should get assessments for a prisoner', async () => {
      // Given
      const expectedResponse = anAllAssessmentDTO()
      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await curiousClient.getAssessmentsByPrisonNumber(prisonNumber)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })

    it('should return null given API returns a not found error', async () => {
      // Given
      const apiErrorResponse = {
        status: 404,
        userMessage: 'Not found',
        developerMessage: 'Not found',
      }

      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await curiousClient.getAssessmentsByPrisonNumber(prisonNumber)

      // Then
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await curiousClient.getAssessmentsByPrisonNumber(prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })
  })
})
