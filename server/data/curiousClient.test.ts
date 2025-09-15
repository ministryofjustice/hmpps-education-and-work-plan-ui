import type { LearnerProfile } from 'curiousApiClient'
import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import CuriousClient from './curiousClient'
import { anAllAssessmentDTO } from '../testsupport/curiousAssessmentsTestDataBuilder'
import { anAllQualificationsDTO } from '../testsupport/curiousQualificationsTestDataBuilder'
import config from '../config'

jest.mock('@ministryofjustice/hmpps-auth-clients')

describe('curiousClient', () => {
  const mockAuthenticationClient = new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>
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

  describe('getLearnerProfile', () => {
    it('should get learner profile', async () => {
      // Given
      const learnerProfile: Array<LearnerProfile> = [
        {
          prn: prisonNumber,
          establishmentId: 'MDI',
          establishmentName: 'MOORLAND (HMP & YOI)',
          uln: '3627609222',
          lddHealthProblem: 'No information provided by the learner.',
          priorAttainment: null,
          qualifications: [
            {
              qualificationType: 'Maths',
              qualificationGrade: 'Entry Level 1',
              assessmentDate: '2021-07-01',
            },
            {
              qualificationType: 'Digital Literacy',
              qualificationGrade: 'Entry Level 3',
              assessmentDate: '2021-07-01',
            },
          ],
          languageStatus: null,
          plannedHours: null,
          rapidAssessmentDate: null,
          inDepthAssessmentDate: null,
          primaryLDDAndHealthProblem: null,
          additionalLDDAndHealthProblems: [],
        },
      ]
      curiousApi
        .get(`/learnerProfile/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, learnerProfile)

      // When
      const actual = await curiousClient.getLearnerProfile(prisonNumber)

      // Then
      expect(actual).toEqual(learnerProfile)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })

    it('should not get learner profile given the API returns a 404', async () => {
      // Given
      const expectedResponseBody = {
        errorCode: 'VC4004',
        errorMessage: 'Not found',
        httpStatusCode: 404,
      }
      curiousApi
        .get(`/learnerProfile/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, expectedResponseBody)

      // When
      const actual = await curiousClient.getLearnerProfile(prisonNumber)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(actual).toBeNull()
    })

    it('should not get learner profile given API returns an error response', async () => {
      // Given
      const apiErrorResponse = {
        errorCode: 'VC4001',
        errorMessage: 'Invalid token',
        httpStatusCode: 401,
      }
      curiousApi
        .get(`/learnerProfile/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(401, apiErrorResponse)

      const expectedError = new Error('Unauthorized')

      // When
      const actual = await curiousClient.getLearnerProfile(prisonNumber).catch(e => e)

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

  describe('getQualificationsByPrisonNumber', () => {
    it('should get qualifications for a prisoner', async () => {
      // Given
      const expectedResponse = anAllQualificationsDTO()
      curiousApi
        .get(`/learnerQualifications/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await curiousClient.getQualificationsByPrisonNumber(prisonNumber)

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
        .get(`/learnerQualifications/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await curiousClient.getQualificationsByPrisonNumber(prisonNumber)

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
        .get(`/learnerQualifications/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await curiousClient.getQualificationsByPrisonNumber(prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith('CURIOUS_API')
      expect(nock.isDone()).toBe(true)
    })
  })
})
