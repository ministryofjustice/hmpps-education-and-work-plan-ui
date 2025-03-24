import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import { InductionService } from '../../services'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import retrieveInductionIfNotInPrisonerContext from './retrieveInductionIfNotInPrisonerContext'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

describe('retrieveInductionIfNotInPrisonerContext', () => {
  const prisonNumber = 'A1234GC'
  const username = 'a-dps-user'

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
    req.user = { username } as Express.User
    req.session = {} as SessionData
    req.params = { prisonNumber } as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
    res.locals = {} as Record<string, unknown>
  })

  const inductionService = {
    getInduction: jest.fn(),
  }

  const requestHandler = retrieveInductionIfNotInPrisonerContext(inductionService as unknown as InductionService)

  it('should retrieve induction and store in session given induction not in prisoner context', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined

    const expectedInductionDto = aValidInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should retrieve induction and store in session given different prisoner's induction already in prisoner context`, async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = aValidInductionDto({ prisonNumber: 'Z1234XY' })

    const expectedInductionDto = aValidInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should not retrieve induction given prisoner's induction already in prisoner context`, async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = aValidInductionDto({ prisonNumber })

    const expectedInductionDto = aValidInductionDto({ prisonNumber })

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).not.toHaveBeenCalled()
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving induction returns null indicating the prisoner does not have an induction', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined

    inductionService.getInduction.mockResolvedValue(null)
    const expectedError = createError(
      404,
      `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
    )

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving induction fails with a 500', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).inductionDto = undefined

    inductionService.getInduction.mockRejectedValue(createError(500, 'Service unavailable'))
    const expectedError = createError(
      500,
      `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
    )

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(getPrisonerContext(req.session, prisonNumber).inductionDto).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
