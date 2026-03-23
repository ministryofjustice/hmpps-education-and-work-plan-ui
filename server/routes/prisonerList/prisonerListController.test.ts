import { Request, Response } from 'express'
import PrisonerListController from './prisonerListController'
import aValidPrisonerSearch from '../../testsupport/prisonerSearchTestDataBuilder'
import SearchPlanStatus from '../../enums/searchPlanStatus'
import SortBy from '../../enums/sortBy'
import SortOrder from '../../enums/sortDirection'

describe('prisonerListController', () => {
  const controller = new PrisonerListController()

  const req = {
    session: {},
    query: {},
    user: { username: 'AUSER_GEN' },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getPrisonerListView', () => {
    it('should get prisoners list view', async () => {
      // Given
      const prisonerListResults = aValidPrisonerSearch()
      const searchOptions = {
        searchTerm: 'John',
        statusFilter: SearchPlanStatus.ACTIVE_PLAN,
        sortBy: SortBy.NAME,
        sortOrder: SortOrder.ASCENDING,
        page: 1,
      }
      res.locals.prisonerListResults = prisonerListResults
      res.locals.searchOptions = searchOptions

      // When
      await controller.getPrisonerListView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', { prisonerListResults, searchOptions })
    })
  })
})
