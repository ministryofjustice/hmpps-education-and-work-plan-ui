import { Request, Response } from 'express'
import SessionListController from './sessionListController'
import SessionTypeValue from '../../enums/sessionTypeValue'
import SortOrder from '../../enums/sortDirection'
import aSessionSearch from '../../testsupport/sessionSearchTestDataBuilder'
import SessionSortBy from '../../enums/sessionSortBy'

describe('sessionListController', () => {
  const controller = new SessionListController()

  const req = {
    session: {},
    query: {},
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getDueSessionsView', () => {
    it('should due sessions view', async () => {
      // Given
      const sessionListSearchResults = aSessionSearch()
      const searchOptions = {
        searchTerm: 'John',
        sessionType: SessionTypeValue.TRANSFER_REVIEW,
        sortBy: SessionSortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        page: 1,
      }
      res.locals.sessionListSearchResults = sessionListSearchResults
      res.locals.searchOptions = searchOptions

      // When
      await controller.getDueSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/new_dueSessions', {
        sessionListSearchResults,
        searchOptions,
      })
    })
  })

  describe('getOnHoldSessionsView', () => {
    it('should on-hold sessions view', async () => {
      // Given
      const sessionListSearchResults = aSessionSearch()
      const searchOptions = {
        searchTerm: 'John',
        sessionType: SessionTypeValue.TRANSFER_REVIEW,
        sortBy: SessionSortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        page: 1,
      }
      res.locals.sessionListSearchResults = sessionListSearchResults
      res.locals.searchOptions = searchOptions

      // When
      await controller.getOnHoldSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/new_onHoldSessions', {
        sessionListSearchResults,
        searchOptions,
      })
    })
  })

  describe('getOverdueSessionsView', () => {
    it('should overdue sessions view', async () => {
      // Given
      const sessionListSearchResults = aSessionSearch()
      const searchOptions = {
        searchTerm: 'John',
        sessionType: SessionTypeValue.TRANSFER_REVIEW,
        sortBy: SessionSortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        page: 1,
      }
      res.locals.sessionListSearchResults = sessionListSearchResults
      res.locals.searchOptions = searchOptions

      // When
      await controller.getOverdueSessionsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/sessionList/new_overdueSessions', {
        sessionListSearchResults,
        searchOptions,
      })
    })
  })
})
