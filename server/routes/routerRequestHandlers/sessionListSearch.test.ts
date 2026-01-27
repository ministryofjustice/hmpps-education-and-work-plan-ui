import { Request, Response } from 'express'
import SessionService from '../../services/sessionService'
import sessionListSearch from './sessionListSearch'
import SortOrder from '../../enums/sortDirection'
import SessionTypeValue from '../../enums/sessionTypeValue'
import SessionStatusValue from '../../enums/sessionStatusValue'
import SessionSortBy from '../../enums/sessionSortBy'
import aSessionSearch from '../../testsupport/sessionSearchTestDataBuilder'

jest.mock('../../services/sessionService')

describe('sessionListSearch', () => {
  const sessionService = new SessionService(null) as jest.Mocked<SessionService>

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
    res.locals.sessionListSearchResults = undefined
    res.locals.searchOptions = undefined
    req.session.sessionListSortOptions = undefined
  })

  describe.each([
    //
    SessionStatusValue.OVERDUE,
    SessionStatusValue.ON_HOLD,
    SessionStatusValue.DUE,
  ])('Session List Search for session type %s', sessionStatusValue => {
    const requestHandler = sessionListSearch(sessionService, sessionStatusValue)

    it('should search sessions given no query string parameters', async () => {
      // Given
      const sessionSearch = aSessionSearch()
      sessionService.searchSessionsInPrison.mockResolvedValue(sessionSearch)

      const expectedSearchOptions = {
        page: 1,
        searchTerm: undefined as string,
        sortBy: 'due-by',
        sortOrder: 'ascending',
        sessionType: undefined as string,
      }
      const expectedSortOptions = 'due-by,ascending'

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.sessionListSearchResults.isFulfilled()).toEqual(true)
      expect(res.locals.sessionListSearchResults.value).toEqual(sessionSearch)
      expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
      expect(req.session.sessionListSortOptions).toEqual(expectedSortOptions)
      expect(sessionService.searchSessionsInPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        1, // page number
        50, // page size
        SessionSortBy.DUE_BY,
        SortOrder.ASCENDING,
        sessionStatusValue,
        undefined, // search term
        undefined, // filter session type
      )
    })

    it('should search sessions given all query string parameters', async () => {
      // Given
      req.query = {
        page: '7',
        searchTerm: 'John',
        sessionType: 'PRE_RELEASE_REVIEW',
        sort: 'location,descending',
      }

      const sessionSearch = aSessionSearch()
      sessionService.searchSessionsInPrison.mockResolvedValue(sessionSearch)

      const expectedSearchOptions = {
        page: 7,
        searchTerm: 'John',
        sortBy: 'location',
        sortOrder: 'descending',
        sessionType: 'PRE_RELEASE_REVIEW',
      }
      const expectedSortOptions = 'location,descending'

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.sessionListSearchResults.isFulfilled()).toEqual(true)
      expect(res.locals.sessionListSearchResults.value).toEqual(sessionSearch)
      expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
      expect(req.session.sessionListSortOptions).toEqual(expectedSortOptions)
      expect(sessionService.searchSessionsInPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        7, // page number
        50, // page size
        SessionSortBy.LOCATION,
        SortOrder.DESCENDING,
        sessionStatusValue,
        'John', // search term
        SessionTypeValue.PRE_RELEASE_REVIEW, // filter session type
      )
    })

    it('should search sessions given session service returns an error', async () => {
      // Given
      sessionService.searchSessionsInPrison.mockRejectedValue(new Error('Some error'))

      const expectedSearchOptions = {
        page: 1,
        searchTerm: undefined as string,
        sortBy: 'due-by',
        sortOrder: 'ascending',
        sessionType: undefined as string,
      }
      const expectedSortOptions = 'due-by,ascending'

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.sessionListSearchResults.isFulfilled()).toEqual(false)
      expect(res.locals.searchOptions).toEqual(expectedSearchOptions)
      expect(req.session.sessionListSortOptions).toEqual(expectedSortOptions)
      expect(sessionService.searchSessionsInPrison).toHaveBeenCalledWith(
        prisonId,
        username,
        1, // page number
        50, // page size
        SessionSortBy.DUE_BY,
        SortOrder.ASCENDING,
        sessionStatusValue,
        undefined, // search term
        undefined, // filter session type
      )
    })
  })
})
