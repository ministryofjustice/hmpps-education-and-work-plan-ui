import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import { PrisonerSearchService } from '../../services'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import retrievePrisonerSummaryIfNotInSession from './retrievePrisonerSummaryIfNotInSession'

describe('retrievePrisonerSummaryIfNotInSession', () => {
  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    locals: {} as Record<string, unknown>,
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
    res.locals = {} as Record<string, unknown>
  })

  const prisonerSearchService = {
    getPrisonerByPrisonNumber: jest.fn(),
  }

  const requestHandler = retrievePrisonerSummaryIfNotInSession(
    prisonerSearchService as unknown as PrisonerSearchService,
  )

  it('should retrieve prisoner and store in session given prisoner not in session', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.session.prisonerSummary = undefined

    const prisonNumber = 'A1234GC'
    const prisonId = 'MDI'
    req.params.prisonNumber = prisonNumber
    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

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
    const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
    prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

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
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.session.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
