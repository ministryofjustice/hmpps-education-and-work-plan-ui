import type { Sessions, SessionsSummary } from 'viewModels'
import { startOfDay } from 'date-fns'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import SessionService from './sessionService'
import aValidSessionSummaryResponse from '../testsupport/sessionSummaryResponseTestDataBuilder'
import aValidSessionsSummary from '../testsupport/sessionsSummaryTestDataBuilder'
import SessionStatusValue from '../enums/sessionStatusValue'
import { aValidSessionResponse, aValidSessionResponses } from '../testsupport/sessionResponseTestDataBuilder'
import { aValidPrisonerSession, aValidSessions } from '../testsupport/prisonerSessionTestDataBuilder'
import SearchSortDirection from '../enums/searchSortDirection'
import SortOrder from '../enums/sortDirection'
import SessionSearchSortField from '../enums/sessionSearchSortField'
import SessionSortBy from '../enums/sessionSortBy'
import SessionTypeValue from '../enums/sessionTypeValue'
import { aSessionSearchResponse, aSessionSearchResponses } from '../testsupport/sessionSearchResponsesTestDataBuilder'
import ReviewScheduleStatusValue from '../enums/reviewScheduleStatusValue'
import aSessionSearch from '../testsupport/sessionSearchTestDataBuilder'

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

  describe('searchSessionsInPrison', () => {
    const page = 3
    const pageSize = 25
    const searchSortField = SessionSearchSortField.CELL_LOCATION
    const sortBy = SessionSortBy.LOCATION
    const searchSortDirection = SearchSortDirection.ASC
    const sortOrder = SortOrder.ASCENDING
    const sessionStatusType = SessionStatusValue.OVERDUE
    const prisonerNameOrNumber = 'A1234BC'
    const sessionType = SessionTypeValue.PRE_RELEASE_REVIEW

    it('should search sessions for a given prison', async () => {
      // Given
      const apiResponse = aSessionSearchResponses({
        totalElements: 1,
        totalPages: 1,
        page: 1,
        last: true,
        first: true,
        pageSize: 50,
        sessions: [
          aSessionSearchResponse({
            forename: 'IFEREECA',
            surname: 'PEIGH',
            prisonNumber: 'A1234BC',
            dateOfBirth: '1969-02-12',
            cellLocation: 'A-1-102',
            sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
            releaseDate: '2025-12-31',
            exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
            exemptionDate: '2025-12-14',
            deadlineDate: '2025-12-20',
          }),
        ],
      })
      educationAndWorkPlanClient.searchSessionsByPrison.mockResolvedValue(apiResponse)

      const expected = aSessionSearch({
        items: [],
        results: { count: 1, from: 1, to: 1 },
        next: { text: 'Next', href: '' },
        previous: { text: 'Previous', href: '' },
        sessions: [
          aValidPrisonerSession({
            prisonNumber: 'A1234BC',
            sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
            deadlineDate: startOfDay('2025-12-20'),
            exemption: {
              exemptionDate: startOfDay('2025-12-14'),
              exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
            },
            reference: null,
          }),
        ],
      })

      // When
      const actual = await sessionService.searchSessionsInPrison(
        prisonId,
        username,
        page,
        pageSize,
        sortBy,
        sortOrder,
        sessionStatusType,
        prisonerNameOrNumber,
        sessionType,
      )

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.searchSessionsByPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        sessionStatusType,
        prisonerNameOrNumber,
        sessionType,
        page,
        pageSize,
        searchSortField,
        searchSortDirection,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      educationAndWorkPlanClient.searchSessionsByPrison.mockRejectedValue(expectedError)

      // When
      const actual = await sessionService
        .searchSessionsInPrison(
          prisonId,
          username,
          page,
          pageSize,
          sortBy,
          sortOrder,
          sessionStatusType,
          prisonerNameOrNumber,
          sessionType,
        )
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(educationAndWorkPlanClient.searchSessionsByPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        sessionStatusType,
        prisonerNameOrNumber,
        sessionType,
        page,
        pageSize,
        searchSortField,
        searchSortDirection,
      )
    })
  })
})
