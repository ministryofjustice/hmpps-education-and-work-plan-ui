import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import type { Prisoner } from 'prisonRegisterApiClient'
import type { PrisonerSummary } from 'viewModels'
import OverviewController from './overviewController'
import { PrisonerSearchService } from '../../services'
import OverviewView from './overviewView'

describe('overviewController', () => {
  const prisonerSearchService = {
    getPrisonerByPrisonNumber: jest.fn(),
  }

  const controller = new OverviewController(prisonerSearchService as unknown as PrisonerSearchService)

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
  })

  it('should get overview view given prisoner is retrieved from prisoner-search API', async () => {
    // Given
    const userToken = 'a-user-token'
    req.user.token = userToken

    const expectedTab = 'overview'
    req.params.tab = expectedTab

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const prisoner = { prisonerNumber: prisonNumber } as Prisoner
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

    const expectedPrisonerSummary = { prisonNumber } as PrisonerSummary
    const expectedView = new OverviewView(expectedPrisonerSummary, expectedTab, prisonNumber)

    // When
    await controller.getOverviewView(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView.renderArgs)
  })

  it('should not get overview view given prisoner is not retrieved from prisoner-search API', async () => {
    // Given
    const userToken = 'a-user-token'
    req.user.token = userToken

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(Error('some error'))

    const expectedError = createError(404, 'Prisoner not found')

    // When
    await controller.getOverviewView(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
