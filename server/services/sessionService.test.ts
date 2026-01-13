import type { Sessions, SessionsSummary } from 'viewModels'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import SessionService from './sessionService'
import aValidSessionSummaryResponse from '../testsupport/sessionSummaryResponseTestDataBuilder'
import aValidSessionsSummary from '../testsupport/sessionsSummaryTestDataBuilder'
import SessionStatusValue from '../enums/sessionStatusValue'
import { aValidSessionResponse, aValidSessionResponses } from '../testsupport/sessionResponseTestDataBuilder'
import { aValidPrisonerSession, aValidSessions } from '../testsupport/prisonerSessionTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')

describe('SessionService', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(
    null,
  ) as unknown as jest.Mocked<EducationAndWorkPlanClient>
  const sessionService = new SessionService(educationAndWorkPlanClient)

  const username = 'a-dps-user'
  const prisonId = 'BXI'

  beforeEach(() => {
    jest.resetAllMocks()
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
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, username)
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
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, username)
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
      expect(educationAndWorkPlanClient.getSessionSummary).toHaveBeenCalledWith(prisonId, username)
    })
  })

  describe('getSessionsInStatusForPrisoners', () => {
    it('should get sessions for prisoners', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const sessionResponses = aValidSessionResponses({
        sessions: [
          aValidSessionResponse({ prisonNumber: 'A1234BC' }),
          aValidSessionResponse({ prisonNumber: 'B5544GD' }),
        ],
      })
      educationAndWorkPlanClient.getSessions.mockResolvedValue(sessionResponses)

      const expected = aValidSessions({
        problemRetrievingData: false,
        sessions: [
          aValidPrisonerSession({ prisonNumber: 'A1234BC' }),
          aValidPrisonerSession({ prisonNumber: 'B5544GD' }),
        ],
      })

      // When
      const actual = await sessionService.getSessionsInStatusForPrisoners(
        prisonNumbers,
        SessionStatusValue.DUE,
        username,
      )

      // Then
      expect(actual).toEqual(expected)
    })

    it('should get sessions for prisoners given there are no sessions for the specified prisoners', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const sessionResponses = aValidSessionResponses({
        sessions: [],
      })
      educationAndWorkPlanClient.getSessions.mockResolvedValue(sessionResponses)

      const expected = aValidSessions({
        problemRetrievingData: false,
        sessions: [],
      })

      // When
      const actual = await sessionService.getSessionsInStatusForPrisoners(
        prisonNumbers,
        SessionStatusValue.DUE,
        username,
      )

      // Then
      expect(actual).toEqual(expected)
    })

    it('should not get sessions for prisoners given API returns an error response', async () => {
      // Given
      const prisonNumbers = ['A1234BC', 'B5544GD']

      const eductionAndWorkPlanApiError = {
        status: 500,
        data: {
          status: 500,
          userMessage: `Error getting Session Summary for prison [${prisonId}]`,
          developerMessage: `Error getting Session Summary for prison [${prisonId}]`,
        },
      }
      educationAndWorkPlanClient.getSessions.mockRejectedValue(eductionAndWorkPlanApiError)

      const expected = {
        problemRetrievingData: true,
      } as Sessions

      // When
      const actual = await sessionService.getSessionsInStatusForPrisoners(
        prisonNumbers,
        SessionStatusValue.DUE,
        username,
      )

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
