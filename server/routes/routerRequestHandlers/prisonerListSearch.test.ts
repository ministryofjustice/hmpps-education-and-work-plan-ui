import { Request, Response } from 'express'
import SearchService from '../../services/searchService'
import prisonerListSearch from './prisonerListSearch'
import aValidPrisonerSearch from '../../testsupport/prisonerSearchTestDataBuilder'
import SortBy from '../../enums/sortBy'
import SortOrder from '../../enums/sortDirection'
import SearchPlanStatus from '../../enums/searchPlanStatus'

jest.mock('../../services/searchService')

describe('prisonerListSearch', () => {
  const searchService = new SearchService(null) as jest.Mocked<SearchService>
  const requestHandler = prisonerListSearch(searchService)

  const prisonId = 'BXI'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    session: {},
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      user: { username, activeCaseLoadId: prisonId },
      apiErrorCallback,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.query = {}
    res.locals.prisonerListResults = undefined
    res.locals.searchOptions = undefined
    req.session.prisonerListSortOptions = undefined
  })

  it('should search prisoners given no query string parameters', async () => {
    // Given
    const prisonerSearch = aValidPrisonerSearch()
    searchService.searchPrisonersInPrison.mockResolvedValue(prisonerSearch)

    const expectedSearchOptions = {
      page: 1,
      searchTerm: undefined as string,
      sortBy: 'reception-date',
      sortOrder: 'descending',
      statusFilter: undefined as string,
    }
    const expectedSortOptions = 'reception-date,descending'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerListResults.isFulfilled()).toEqual(true)
    expect(res.locals.prisonerListResults.value).toEqual(prisonerSearch)
    expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
    expect(req.session.prisonerListSortOptions).toEqual(expectedSortOptions)
    expect(searchService.searchPrisonersInPrison).toHaveBeenCalledWith(
      prisonId,
      username,
      1, // page number
      50, // page size
      SortBy.RECEPTION_DATE,
      SortOrder.DESCENDING,
      undefined, // search term
      undefined, // filter plan status
    )
  })

  it('should search prisoners given all query string parameters', async () => {
    // Given
    req.query = {
      page: '7',
      searchTerm: 'John',
      statusFilter: 'EXEMPT',
      sort: 'location,ascending',
    }

    const prisonerSearch = aValidPrisonerSearch()
    searchService.searchPrisonersInPrison.mockResolvedValue(prisonerSearch)

    const expectedSearchOptions = {
      page: 7,
      searchTerm: 'John',
      sortBy: 'location',
      sortOrder: 'ascending',
      statusFilter: 'EXEMPT',
    }
    const expectedSortOptions = 'location,ascending'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerListResults.isFulfilled()).toEqual(true)
    expect(res.locals.prisonerListResults.value).toEqual(prisonerSearch)
    expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
    expect(req.session.prisonerListSortOptions).toEqual(expectedSortOptions)
    expect(searchService.searchPrisonersInPrison).toHaveBeenCalledWith(
      prisonId,
      username,
      7, // page number
      50, // page size
      SortBy.LOCATION,
      SortOrder.ASCENDING,
      'John', // search term
      SearchPlanStatus.EXEMPT, // filter plan status
    )
  })

  it('should search prisoners given search service returns an error', async () => {
    // Given
    searchService.searchPrisonersInPrison.mockRejectedValue(new Error('Some error'))

    const expectedSearchOptions = {
      page: 1,
      searchTerm: undefined as string,
      sortBy: 'reception-date',
      sortOrder: 'descending',
      statusFilter: undefined as string,
    }
    const expectedSortOptions = 'reception-date,descending'

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.prisonerListResults.isFulfilled()).toEqual(false)
    expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
    expect(req.session.prisonerListSortOptions).toEqual(expectedSortOptions)
    expect(searchService.searchPrisonersInPrison).toHaveBeenCalledWith(
      prisonId,
      username,
      1, // page number
      50, // page size
      SortBy.RECEPTION_DATE,
      SortOrder.DESCENDING,
      undefined, // search term
      undefined, // filter plan status
    )
  })
})
