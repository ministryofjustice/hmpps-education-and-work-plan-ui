import { SessionData } from 'express-session'
import type { PrisonerSearchSummary } from 'viewModels'
import type { Locals } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import PrisonerListController from './prisonerListController'
import { PrisonerListService } from '../../services'
import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'

describe('prisonerListController', () => {
  const jimmyLightFingers = aValidPrisonerSearchSummary({
    firstName: 'Jimmy',
    lastName: 'Lightfingers',
    receptionDate: '2023-10-01',
    hasCiagInduction: true,
    hasActionPlan: true,
  })
  const jimmyMcShifty = aValidPrisonerSearchSummary({
    firstName: 'Jimmy',
    lastName: 'McShifty',
    receptionDate: '2000-07-23',
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const donVitoCorleone = aValidPrisonerSearchSummary({
    firstName: 'Vito',
    lastName: 'Corleone',
    receptionDate: '2020-09-10',
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const prisonerSearchSummaries = [jimmyLightFingers, jimmyMcShifty, donVitoCorleone]

  const prisonerListService = {
    getPrisonerSearchSummariesForPrisonId: jest.fn(),
  }

  const controller = new PrisonerListController(prisonerListService as unknown as PrisonerListService)

  const req = {
    session: {} as SessionData,
    query: {},
    user: {} as Express.User,
  }
  const res = {
    render: jest.fn(),
    locals: {} as Locals,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    prisonerListService.getPrisonerSearchSummariesForPrisonId.mockResolvedValue(prisonerSearchSummaries)

    res.locals = {
      user: {
        activeCaseLoadId: 'BXI',
      },
    }
    req.user.token = 'some-token'
    req.user.username = 'AUSER_GEN'
    req.session = {} as SessionData
  })

  describe('getPrisonerListView', () => {
    it('should get prisoner list view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const expectedView: RenderedPrisonerListView = {
        currentPageOfRecords: [jimmyLightFingers, donVitoCorleone, jimmyMcShifty], // default sort order (reception-date descending) applied
        searchTerm: '',
        statusFilter: '',
        sortBy: 'reception-date',
        sortOrder: 'descending',
        items: [],
        nextPage: {
          href: '',
          text: 'Next',
        },
        previousPage: {
          href: '',
          text: 'Previous',
        },
        results: {
          count: 3,
          from: 1,
          to: 3,
        },
      }

      // When
      await controller.getPrisonerListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
      expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
        'BXI',
        0,
        9999,
        'AUSER_GEN',
        'some-token',
      )
    })

    describe('filtering', () => {
      it('should get prisoner list view given name filtering', async () => {
        // Given
        req.query = {
          searchTerm: 'Jimmy',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyLightFingers, jimmyMcShifty],
          searchTerm: 'Jimmy',
          statusFilter: '',
          sortBy: 'reception-date',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 2,
            from: 1,
            to: 2,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
      })

      it('should get prisoner list view given status filtering', async () => {
        // Given
        req.query = {
          statusFilter: 'NEEDS_PLAN',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [donVitoCorleone, jimmyMcShifty], // default sort order (reception-date descending) applied
          searchTerm: '',
          statusFilter: 'NEEDS_PLAN',
          sortBy: 'reception-date',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 2,
            from: 1,
            to: 2,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
      })

      it('should get prisoner list view given name and status filtering', async () => {
        // Given
        req.query = {
          searchTerm: 'Jimmy',
          statusFilter: 'NEEDS_PLAN',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyMcShifty],
          searchTerm: 'Jimmy',
          statusFilter: 'NEEDS_PLAN',
          sortBy: 'reception-date',
          sortOrder: 'descending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 1,
            from: 1,
            to: 1,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
      })
    })

    describe('sorting', () => {
      it('should get prisoner list view given sorting by name ascending via query string parameter', async () => {
        // Given
        req.query = {
          sort: 'name,ascending',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [donVitoCorleone, jimmyLightFingers, jimmyMcShifty],
          searchTerm: '',
          statusFilter: '',
          sortBy: 'name',
          sortOrder: 'ascending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 3,
            from: 1,
            to: 3,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
        expect(req.session.prisonerListSortOptions).toEqual('name,ascending') // expect current sort options saved in session
      })

      it('should get prisoner list view given invalid sort options via query string parameter', async () => {
        // Given
        req.query = {
          sort: 'unknown-field,nearest-neighbour',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyLightFingers, donVitoCorleone, jimmyMcShifty], // default sort order (reception-date descending) applied
          searchTerm: '',
          statusFilter: '',
          sortBy: 'reception-date', // current sort by field is `reception-date` given the requested value was invalid
          sortOrder: 'descending', // current sort order is `descending` given the requested value was invalid
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 3,
            from: 1,
            to: 3,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
        expect(req.session.prisonerListSortOptions).toEqual('reception-date,descending') // expect default sort options saved in session
      })

      it('should get prisoner list view given sorting by name ascending via session variable', async () => {
        // Given
        req.query = {}
        req.session.prisonerListSortOptions = 'name,ascending'

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [donVitoCorleone, jimmyLightFingers, jimmyMcShifty],
          searchTerm: '',
          statusFilter: '',
          sortBy: 'name',
          sortOrder: 'ascending',
          items: [],
          nextPage: {
            href: '',
            text: 'Next',
          },
          previousPage: {
            href: '',
            text: 'Previous',
          },
          results: {
            count: 3,
            from: 1,
            to: 3,
          },
        }

        // When
        await controller.getPrisonerListView(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.render).toHaveBeenCalledWith('pages/prisonerList/index', expectedView)
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith(
          'BXI',
          0,
          9999,
          'AUSER_GEN',
          'some-token',
        )
        expect(req.session.prisonerListSortOptions).toEqual('name,ascending') // expect current sort options saved in session
      })
    })
  })
})

interface RenderedPrisonerListView {
  currentPageOfRecords: PrisonerSearchSummary[]
  searchTerm: string
  statusFilter: string
  sortBy: string
  sortOrder: string
  items: Array<{ href: string; selected: boolean; text: string; type: undefined }>
  results: { count: number; from: number; to: number }
  previousPage: { href: string; text: string }
  nextPage: { href: string; text: string }
}
