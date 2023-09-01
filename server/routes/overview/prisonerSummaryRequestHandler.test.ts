import type { Prisoner } from 'prisonRegisterApiClient'
import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import PrisonerSummaryRequestHandler from './prisonerSummaryRequestHandler'
import { PrisonerSearchService } from '../../services'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'

describe('prisonerSummaryRequestHandler', () => {
  const prisonerSearchService = {
    getPrisonerByPrisonNumber: jest.fn(),
  }

  const requestHandler = new PrisonerSummaryRequestHandler(prisonerSearchService as unknown as PrisonerSearchService)

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

  it('should retrieve prisoner and store in session given prisoner not in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerSummary = undefined

    const prisonNumber = 'A1234GC'
    const prisonId = 'MDI'
    req.params.prisonNumber = prisonNumber
    const prisoner = {
      prisonerNumber: prisonNumber,
      prisonId,
      releaseDate: '2025-12-31',
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      dateOfBirth: '1969-02-12',
      receptionDate: '1999-08-29',
    } as Prisoner
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

    // When
    await requestHandler.getPrisonerSummary(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve prisoner and store in session given different prisoner already in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerSummary = aValidPrisonerSummary('Z1234XY', 'BXI')

    const prisonNumber = 'A1234GC'
    const prisonId = 'MDI'
    req.params.prisonNumber = prisonNumber
    const prisoner = {
      prisonerNumber: prisonNumber,
      prisonId,
      releaseDate: '2025-12-31',
      firstName: 'Jimmy',
      lastName: 'Lightfingers',
      dateOfBirth: '1969-02-12',
      receptionDate: '1999-08-29',
    } as Prisoner
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(prisoner)

    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

    // When
    await requestHandler.getPrisonerSummary(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
    expect(next).toHaveBeenCalled()
  })

  it('should not retrieve prisoner given prisoner already in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'
    const prisonId = 'MDI'

    req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

    req.params.prisonNumber = prisonNumber
    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

    // When
    await requestHandler.getPrisonerSummary(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).not.toHaveBeenCalled()
    expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving prisoner fails with a 404', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerSummary = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(404, 'Not Found'))
    const expectedError = createError(404, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler.getPrisonerSummary(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving prisoner fails with a 500', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerSummary = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(500, 'Not Found'))
    const expectedError = createError(500, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

    // When
    await requestHandler.getPrisonerSummary(
      req as undefined as Request,
      res as undefined as Response,
      next as undefined as NextFunction,
    )

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
