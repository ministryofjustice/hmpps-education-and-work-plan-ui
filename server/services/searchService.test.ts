import { startOfDay } from 'date-fns'
import SearchService from './searchService'
import EducationAndWorkPlanClient from '../data/educationAndWorkPlanClient'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import aValidPrisonerSearchSummary from '../testsupport/prisonerSearchSummaryTestDataBuilder'
import SearchPlanStatus from '../enums/searchPlanStatus'
import aPersonResponse from '../testsupport/personResponseTestDataBuilder'
import aPersonSearchResult from '../testsupport/personSearchResultTestDataBuilder'
import aValidPrisonerSearch from '../testsupport/prisonerSearchTestDataBuilder'

jest.mock('../data/educationAndWorkPlanClient')

describe('searchService', () => {
  const educationAndWorkPlanClient = new EducationAndWorkPlanClient(null) as jest.Mocked<EducationAndWorkPlanClient>
  const searchService = new SearchService(educationAndWorkPlanClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('searchPrisonersInPrison', () => {
    const prisonId = 'MDI'
    const username = 'some-username'
    const page = 3
    const pageSize = 25
    const sortBy = SearchSortField.CELL_LOCATION
    const sortDirection = SearchSortDirection.ASC
    const prisonerNameOrNumber = 'A1234BC'
    const planStatus = SearchPlanStatus.ACTIVE_PLAN

    it('should search prisoners in prison', async () => {
      // Given
      const apiResponse = aPersonSearchResult({
        totalElements: 1,
        totalPages: 1,
        page: 1,
        last: true,
        first: true,
        pageSize: 50,
        people: [
          aPersonResponse({
            forename: 'IFEREECA',
            surname: 'PEIGH',
            prisonNumber: 'A1234BC',
            dateOfBirth: '1969-02-12',
            enteredPrisonOn: '2023-10-15',
            releaseDate: '2025-12-31',
            cellLocation: 'A-1-102',
            planStatus: 'ACTIVE_PLAN',
          }),
        ],
      })
      educationAndWorkPlanClient.searchByPrison.mockResolvedValue(apiResponse)

      const expected = aValidPrisonerSearch({
        items: [],
        results: { count: 1, from: 1, to: 1 },
        next: { text: 'Next', href: '' },
        previous: { text: 'Previous', href: '' },
        prisoners: [
          aValidPrisonerSearchSummary({
            prisonNumber: 'A1234BC',
            prisonId: 'MDI',
            firstName: 'IFEREECA',
            lastName: 'PEIGH',
            dateOfBirth: startOfDay('1969-02-12'),
            receptionDate: startOfDay('2023-10-15'),
            releaseDate: startOfDay('2025-12-31'),
            location: 'A-1-102',
            planStatus: SearchPlanStatus.ACTIVE_PLAN,
            restrictedPatient: null,
            supportingPrisonId: null,
            hasCiagInduction: null,
            hasActionPlan: null,
          }),
        ],
      })

      // When
      const actual = await searchService.searchPrisonersInPrison(
        prisonId,
        username,
        page,
        pageSize,
        sortBy,
        sortDirection,
        prisonerNameOrNumber,
        planStatus,
      )

      // Then
      expect(actual).toEqual(expected)
      expect(educationAndWorkPlanClient.searchByPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        prisonerNameOrNumber,
        planStatus,
        page,
        pageSize,
        sortBy,
        sortDirection,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      educationAndWorkPlanClient.searchByPrison.mockRejectedValue(expectedError)

      // When
      const actual = await searchService
        .searchPrisonersInPrison(
          prisonId,
          username,
          page,
          pageSize,
          sortBy,
          sortDirection,
          prisonerNameOrNumber,
          planStatus,
        )
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(educationAndWorkPlanClient.searchByPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        prisonerNameOrNumber,
        planStatus,
        page,
        pageSize,
        sortBy,
        sortDirection,
      )
    })
  })
})
