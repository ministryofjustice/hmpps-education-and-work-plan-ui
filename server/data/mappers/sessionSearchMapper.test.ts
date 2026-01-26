import type { SessionSearchResponses } from 'educationAndWorkPlanApiClient'
import { startOfDay } from 'date-fns'
import { toSessionSearch, toPrisonerSession } from './sessionSearchMapper'
import SortOrder from '../../enums/sortDirection'
import {
  aSessionSearchResponse,
  aSessionSearchResponses,
} from '../../testsupport/sessionSearchResponsesTestDataBuilder'
import aSessionSearch from '../../testsupport/sessionSearchTestDataBuilder'
import { aValidPrisonerSession } from '../../testsupport/prisonerSessionTestDataBuilder'
import SessionSortBy from '../../enums/sessionSortBy'
import SessionStatusValue from '../../enums/sessionStatusValue'
import SessionTypeValue from '../../enums/sessionTypeValue'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'

describe('sessionSearchMapper', () => {
  describe('toSessionSearch', () => {
    it('should map a SessionSearchResponses to a SessionSearch', () => {
      // Given
      const sessionSearchResponses = aSessionSearchResponses({
        totalElements: 3,
        totalPages: 3,
        page: 2,
        last: false,
        first: false,
        pageSize: 1,
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

      const expected = aSessionSearch({
        results: {
          count: 3,
          from: 2,
          to: 2,
        },
        items: [
          {
            text: '1',
            href: '?searchTerm=Peigh&sessionStatusType=ON_HOLD&sessionType=PRE_RELEASE_REVIEW&sort=session-type,ascending&page=1',
            selected: false,
          },
          {
            text: '2',
            href: '?searchTerm=Peigh&sessionStatusType=ON_HOLD&sessionType=PRE_RELEASE_REVIEW&sort=session-type,ascending&page=2',
            selected: true,
          },
          {
            text: '3',
            href: '?searchTerm=Peigh&sessionStatusType=ON_HOLD&sessionType=PRE_RELEASE_REVIEW&sort=session-type,ascending&page=3',
            selected: false,
          },
        ],
        previous: {
          text: 'Previous',
          href: '?searchTerm=Peigh&sessionStatusType=ON_HOLD&sessionType=PRE_RELEASE_REVIEW&sort=session-type,ascending&page=1',
        },
        next: {
          text: 'Next',
          href: '?searchTerm=Peigh&sessionStatusType=ON_HOLD&sessionType=PRE_RELEASE_REVIEW&sort=session-type,ascending&page=3',
        },
        sessions: [
          aValidPrisonerSession({
            prisonNumber: 'A1234BC',
            firstName: 'IFEREECA',
            lastName: 'PEIGH',
            location: 'A-1-102',
            releaseDate: startOfDay('2025-12-31'),
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

      const searchOptions = {
        sortBy: SessionSortBy.SESSION_TYPE,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        sessionStatusType: SessionStatusValue.ON_HOLD,
        sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
      }

      // When
      const actual = toSessionSearch(sessionSearchResponses, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map an empty SessionSearchResponses to a SessionSearch', () => {
      // Given
      const sessionSearchResponses = aSessionSearchResponses({
        totalElements: 0,
        totalPages: 0,
        page: 1,
        last: false,
        first: false,
        pageSize: 20,
        sessions: [],
      })

      const expected = aSessionSearch({
        results: {
          count: 0,
          from: 0,
          to: 0,
        },
        items: [],
        previous: {
          text: 'Previous',
          href: '',
        },
        next: {
          text: 'Next',
          href: '',
        },
        sessions: [],
      })

      const searchOptions = {
        sortBy: SessionSortBy.SESSION_TYPE,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        sessionStatusType: SessionStatusValue.ON_HOLD,
        sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
      }

      // When
      const actual = toSessionSearch(sessionSearchResponses, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a null SessionSearchResponses to a PrisonerSearch', () => {
      // Given
      const sessionSearchResponses: SessionSearchResponses = null

      const expected = aSessionSearch({
        results: {
          count: 0,
          from: 0,
          to: 0,
        },
        items: [],
        previous: {
          text: 'Previous',
          href: '',
        },
        next: {
          text: 'Next',
          href: '',
        },
        sessions: [],
      })

      const searchOptions = {
        sortBy: SessionSortBy.SESSION_TYPE,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        sessionStatusType: SessionStatusValue.ON_HOLD,
        sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
      }

      // When
      const actual = toSessionSearch(sessionSearchResponses, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toPrisonerSession', () => {
    it('should map a SessionSearchResponse to a PrisonerSession', () => {
      // Given
      const sessionSearchResponse = aSessionSearchResponse({
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
      })

      const expected = aValidPrisonerSession({
        prisonNumber: 'A1234BC',
        firstName: 'IFEREECA',
        lastName: 'PEIGH',
        location: 'A-1-102',
        releaseDate: startOfDay('2025-12-31'),
        sessionType: SessionTypeValue.PRE_RELEASE_REVIEW,
        deadlineDate: startOfDay('2025-12-20'),
        exemption: {
          exemptionDate: startOfDay('2025-12-14'),
          exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
        },
        reference: null,
      })

      // When
      const actual = toPrisonerSession(sessionSearchResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
