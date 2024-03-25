import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import { InductionService } from '../../services'
import { aShortQuestionSetInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import retrieveInductionIfNotInSession from './retrieveInductionIfNotInSession'

describe('retrieveInductionIfNotInSession', () => {
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

  const inductionService = {
    getInduction: jest.fn(),
  }

  const requestHandler = retrieveInductionIfNotInSession(inductionService as unknown as InductionService)

  it('should retrieve induction and store in session given induction not in session', async () => {
    // Given
    const token = 'a-user-token'
    req.user.token = token

    req.session.inductionDto = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
    expect(req.session.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should retrieve induction and store in session given different prisoner's induction already in session`, async () => {
    // Given
    const token = 'a-user-token'
    req.user.token = token

    req.session.inductionDto = aShortQuestionSetInductionDto({ prisonNumber: 'Z1234XY' })

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
    expect(req.session.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should not retrieve induction given prisoner's induction already in session`, async () => {
    // Given
    const token = 'a-user-token'
    req.user.token = token

    const prisonNumber = 'A1234GC'

    req.session.inductionDto = aShortQuestionSetInductionDto({ prisonNumber })

    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).not.toHaveBeenCalled()
    expect(req.session.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving induction fails with a 404', async () => {
    // Given
    const token = 'a-user-token'
    req.user.token = token

    req.session.inductionDto = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    inductionService.getInduction.mockRejectedValue(createError(404, 'Not Found'))
    const expectedError = createError(
      404,
      `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
    )

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
    expect(req.session.inductionDto).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving induction fails with a 500', async () => {
    // Given
    const token = 'a-user-token'
    req.user.token = token

    req.session.inductionDto = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    inductionService.getInduction.mockRejectedValue(createError(500, 'Service unavailable'))
    const expectedError = createError(
      500,
      `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
    )

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
    expect(req.session.prisonerSummary).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
