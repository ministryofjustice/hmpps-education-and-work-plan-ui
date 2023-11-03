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
    hasCiagInduction: true,
    hasActionPlan: true,
  })
  const jimmyMcShifty = aValidPrisonerSearchSummary({
    firstName: 'Jimmy',
    lastName: 'McShifty',
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const donVitoCorleone = aValidPrisonerSearchSummary({
    firstName: 'Vito',
    lastName: 'Corleone',
    hasCiagInduction: false,
    hasActionPlan: false,
  })
  const prisonerSearchSummaries = [jimmyLightFingers, jimmyMcShifty, donVitoCorleone]

  const prisonerListService = {
    getPrisonerSearchSummariesForPrisonId: jest.fn(),
  }

  const controller = new PrisonerListController(prisonerListService as unknown as PrisonerListService)

  const req = {
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
  })

  describe('getPrisonerListView', () => {
    it('should get prisoner list view given no filtering, paging or sorting query string parameters', async () => {
      // Given
      req.query = {}

      const expectedView: {
        currentPageOfRecords: PrisonerSearchSummary[]
        searchTerm?: string
        statusFilter?: string
      } = {
        currentPageOfRecords: [jimmyLightFingers, jimmyMcShifty, donVitoCorleone],
        searchTerm: undefined,
        statusFilter: undefined,
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

    it('should get prisoner list view given name filtering', async () => {
      // Given
      req.query = {
        searchTerm: 'Jimmy',
      }

      const expectedView: {
        currentPageOfRecords: PrisonerSearchSummary[]
        searchTerm?: string
        statusFilter?: string
      } = {
        currentPageOfRecords: [jimmyLightFingers, jimmyMcShifty],
        searchTerm: 'Jimmy',
        statusFilter: undefined,
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

      const expectedView: {
        currentPageOfRecords: PrisonerSearchSummary[]
        searchTerm?: string
        statusFilter?: string
      } = {
        currentPageOfRecords: [jimmyMcShifty, donVitoCorleone],
        searchTerm: undefined,
        statusFilter: 'NEEDS_PLAN',
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

      const expectedView: {
        currentPageOfRecords: PrisonerSearchSummary[]
        searchTerm?: string
        statusFilter?: string
      } = {
        currentPageOfRecords: [jimmyMcShifty],
        searchTerm: 'Jimmy',
        statusFilter: 'NEEDS_PLAN',
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
})
