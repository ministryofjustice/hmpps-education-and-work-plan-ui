import type { SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import HmppsAuthClient from '../data/hmppsAuthClient'
import SessionService from './sessionService'
import aValidSessionSummaryResponse from '../testsupport/sessionSummaryResponseTestDataBuilder'
import aValidSessionsSummary from '../testsupport/sessionsSummaryTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')
jest.mock('../data/hmppsAuthClient')

describe('SessionService', () => {
  const educationAndWorkPlanClient =
    new EducationAndWorkPlanClient() as unknown as jest.Mocked<EducationAndWorkPlanClient>
  const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

  const sessionService = new SessionService(educationAndWorkPlanClient, hmppsAuthClient)

  const systemToken = 'a-system-token'
  const username = 'a-dps-user'
  const prisonId = 'BXI'

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
  })

  describe('getSessionsSummary', () => {
    it('should get sessions summary given API returns a SessionsSummaryResponse', async () => {
      // Given
      const sessionSummaryResponse = aValidSessionSummaryResponse({
        overdueReviews: 1,
        overdueInductions: 2,
        dueReviews: 3,
        dueInductions: 4,
        exemptReviews: 5,
        exemptInductions: 6,
      })
      educationAndWorkPlanClient.getSessionSummary.mockResolvedValue(sessionSummaryResponse)

      const expected = aValidSessionsSummary({
        overdueSessionCount: 3,
        dueSessionCount: 7,
        onHoldSessionCount: 11,
        problemRetrievingData: false,
      })

      // When
      const actual = await sessionService.getSessionsSummary(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, systemToken)
    })

    it('should not get sessions summary given API returns a null SessionsSummaryResponse', async () => {
      // Given
      educationAndWorkPlanClient.getSessionSummary.mockResolvedValue(null)

      const expected = {
        problemRetrievingData: true,
      } as SessionsSummary

      // When
      const actual = await sessionService.getSessionsSummary(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, systemToken)
    })

    it('should not get sessions summary given API returns an error', async () => {
      // Given
      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error getting Session Summary for prison [${prisonId}]`,
          developerMessage: `Error getting Session Summary for prison [${prisonId}]`,
        },
      }
      educationAndWorkPlanClient.getSessionSummary.mockRejectedValue(eductionAndWorkPlanApiError)

      const expected = {
        problemRetrievingData: true,
      } as SessionsSummary

      // When
      const actual = await sessionService.getSessionsSummary(prisonId, username)

      // Then
      expect(actual).toEqual(expected)
      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, systemToken)
    })
  })
})
