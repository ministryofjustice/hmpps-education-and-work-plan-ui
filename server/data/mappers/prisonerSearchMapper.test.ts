import type { PersonSearchResult } from 'educationAndWorkPlanApiClient'
import { startOfDay } from 'date-fns'
import { toPrisonerSearch, toPrisonerSearchSummary } from './prisonerSearchMapper'
import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'
import SortBy from '../../enums/sortBy'
import SortOrder from '../../enums/sortDirection'
import SearchPlanStatus from '../../enums/searchPlanStatus'
import aPersonResponse from '../../testsupport/personResponseTestDataBuilder'
import aPersonSearchResult from '../../testsupport/personSearchResultTestDataBuilder'
import aValidPrisonerSearch from '../../testsupport/prisonerSearchTestDataBuilder'

describe('prisonerSearchMapper', () => {
  const prisonId = 'BXI'

  describe('toPrisonerSearch', () => {
    it('should map a PersonSearchResult to a PrisonerSearch', () => {
      // Given
      const personSearchResult = aPersonSearchResult({
        totalElements: 3,
        totalPages: 3,
        page: 2,
        last: false,
        first: false,
        pageSize: 1,
        people: [
          aPersonResponse({
            forename: 'IFEREECA',
            surname: 'PEIGH',
            prisonNumber: 'A1234BC',
            dateOfBirth: '1969-02-12',
            enteredPrisonOn: '2025-02-01',
            releaseDate: '2025-12-31',
            cellLocation: 'A-1-102',
            planStatus: 'EXEMPT',
          }),
        ],
      })

      const expected = aValidPrisonerSearch({
        results: {
          count: 3,
          from: 2,
          to: 2,
        },
        items: [
          { text: '1', href: '?searchTerm=Peigh&planStatus=EXEMPT&sort=name,ascending&page=1', selected: false },
          { text: '2', href: '?searchTerm=Peigh&planStatus=EXEMPT&sort=name,ascending&page=2', selected: true },
          { text: '3', href: '?searchTerm=Peigh&planStatus=EXEMPT&sort=name,ascending&page=3', selected: false },
        ],
        previous: {
          text: 'Previous',
          href: '?searchTerm=Peigh&planStatus=EXEMPT&sort=name,ascending&page=1',
        },
        next: {
          text: 'Next',
          href: '?searchTerm=Peigh&planStatus=EXEMPT&sort=name,ascending&page=3',
        },
        prisoners: [
          aValidPrisonerSearchSummary({
            prisonNumber: 'A1234BC',
            prisonId: 'BXI',
            firstName: 'IFEREECA',
            lastName: 'PEIGH',
            dateOfBirth: startOfDay('1969-02-12'),
            receptionDate: startOfDay('2025-02-01'),
            releaseDate: startOfDay('2025-12-31'),
            location: 'A-1-102',
            planStatus: SearchPlanStatus.EXEMPT,
            restrictedPatient: null,
            supportingPrisonId: null,
            hasCiagInduction: null,
            hasActionPlan: null,
          }),
        ],
      })

      const searchOptions = {
        prisonId,
        sortBy: SortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        planStatus: SearchPlanStatus.EXEMPT,
      }

      // When
      const actual = toPrisonerSearch(personSearchResult, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map an empty PersonSearchResult to a PrisonerSearch', () => {
      // Given
      const personSearchResult = aPersonSearchResult({
        totalElements: 0,
        totalPages: 0,
        page: 1,
        last: false,
        first: false,
        pageSize: 20,
        people: [],
      })

      const expected = aValidPrisonerSearch({
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
        prisoners: [],
      })

      const searchOptions = {
        prisonId,
        sortBy: SortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        planStatus: SearchPlanStatus.EXEMPT,
      }

      // When
      const actual = toPrisonerSearch(personSearchResult, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a null PersonSearchResult to a PrisonerSearch', () => {
      // Given
      const personSearchResult: PersonSearchResult = null

      const expected = aValidPrisonerSearch({
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
        prisoners: [],
      })

      const searchOptions = {
        prisonId,
        sortBy: SortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        searchTerm: 'Peigh',
        planStatus: SearchPlanStatus.EXEMPT,
      }

      // When
      const actual = toPrisonerSearch(personSearchResult, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toPrisonerSearchSummary', () => {
    it('should map a PersonResponse to a PrisonerSearchSummary', () => {
      // Given
      const personResponse = aPersonResponse({
        forename: 'IFEREECA',
        surname: 'PEIGH',
        prisonNumber: 'A1234BC',
        dateOfBirth: '1969-02-12',
        cellLocation: 'A-1-102',
        releaseDate: '2025-12-31',
        enteredPrisonOn: '2025-01-20',
        planStatus: 'NEEDS_PLAN',
      })

      const expected = aValidPrisonerSearchSummary({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        firstName: 'IFEREECA',
        lastName: 'PEIGH',
        dateOfBirth: startOfDay('1969-02-12'),
        receptionDate: startOfDay('2025-01-20'),
        releaseDate: startOfDay('2025-12-31'),
        location: 'A-1-102',
        planStatus: SearchPlanStatus.NEEDS_PLAN,
        restrictedPatient: null,
        supportingPrisonId: null,
        hasCiagInduction: null,
        hasActionPlan: null,
      })

      // When
      const actual = toPrisonerSearchSummary(personResponse, prisonId)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
