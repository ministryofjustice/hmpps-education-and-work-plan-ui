import createError from 'http-errors'
import { SessionData } from 'express-session'
import { startOfDay } from 'date-fns'
import type { PrisonerSearchSummary } from 'viewModels'
import type { Locals } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import PrisonerListController from './prisonerListController'
import { PrisonerListService } from '../../services'
import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'

describe('prisonerListController', () => {
  const jimmyLilac = aValidPrisonerSearchSummary({
    firstName: 'Jimmy',
    lastName: 'Lilac',
    receptionDate: startOfDay('2023-10-01'),
    hasCiagInduction: true,
    hasActionPlan: true,
  })
  const jimmyOrange = aValidPrisonerSearchSummary({
    firstName: 'Jimmy',
    lastName: 'Orange',
    receptionDate: startOfDay('2000-07-23'),
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const valhallaCavalier = aValidPrisonerSearchSummary({
    firstName: 'Valhalla',
    lastName: 'Cavalier',
    receptionDate: startOfDay('2020-09-10'),
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const prisonerSearchSummaries = [jimmyLilac, jimmyOrange, valhallaCavalier]

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
    req.user.username = 'AUSER_GEN'
    req.session = {} as SessionData
  })

  describe('getPrisonerListView', () => {
    it('should get prisoner list view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const expectedView: RenderedPrisonerListView = {
        currentPageOfRecords: [jimmyLilac, valhallaCavalier, jimmyOrange], // default sort order (reception-date descending) applied
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
      expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
    })

    it('should not get prisoner list view given error calling service to get prisoner list summaries', async () => {
      // Given
      req.query = {}

      prisonerListService.getPrisonerSearchSummariesForPrisonId.mockRejectedValue(
        createError(500, 'Service unavailable'),
      )
      const expectedError = createError(500, `Error producing prisoner list for prison BXI`)

      // When
      await controller.getPrisonerListView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
      expect(res.render).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    describe('filtering', () => {
      it('should get prisoner list view given name filtering', async () => {
        // Given
        req.query = {
          searchTerm: 'Jimmy',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyLilac, jimmyOrange],
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
      })

      it('should get prisoner list view given status filtering', async () => {
        // Given
        req.query = {
          statusFilter: 'NEEDS_PLAN',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [valhallaCavalier, jimmyOrange], // default sort order (reception-date descending) applied
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
      })

      it('should get prisoner list view given name and status filtering', async () => {
        // Given
        req.query = {
          searchTerm: 'Jimmy',
          statusFilter: 'NEEDS_PLAN',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyOrange],
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
      })
    })

    describe('sorting', () => {
      it('should get prisoner list view given sorting by name ascending via query string parameter', async () => {
        // Given
        req.query = {
          sort: 'name,ascending',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [valhallaCavalier, jimmyLilac, jimmyOrange],
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
        expect(req.session.prisonerListSortOptions).toEqual('name,ascending') // expect current sort options saved in session
      })

      it('should get prisoner list view given invalid sort options via query string parameter', async () => {
        // Given
        req.query = {
          sort: 'unknown-field,nearest-neighbour',
        }

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [jimmyLilac, valhallaCavalier, jimmyOrange], // default sort order (reception-date descending) applied
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
        expect(req.session.prisonerListSortOptions).toEqual('reception-date,descending') // expect default sort options saved in session
      })

      it('should get prisoner list view given sorting by name ascending via session variable', async () => {
        // Given
        req.query = {}
        req.session.prisonerListSortOptions = 'name,ascending'

        const expectedView: RenderedPrisonerListView = {
          currentPageOfRecords: [valhallaCavalier, jimmyLilac, jimmyOrange],
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
        expect(prisonerListService.getPrisonerSearchSummariesForPrisonId).toHaveBeenCalledWith('BXI', 'AUSER_GEN')
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
