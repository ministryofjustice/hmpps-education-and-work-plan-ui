import createError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { InductionService } from '../../services'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import retrieveInductionIfNotInJourneyData from './retrieveInductionIfNotInJourneyData'

describe('retrieveInductionIfNotInJourneyData', () => {
  const req = {
    user: {},
    params: {},
    journeyData: {},
  } as unknown as Request
  const res = {} as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.params = {}
    req.journeyData = {}
  })

  const inductionService = {
    getInduction: jest.fn(),
  }

  const requestHandler = retrieveInductionIfNotInJourneyData(inductionService as unknown as InductionService)

  it('should retrieve induction and store in journeyData given induction not in journeyData', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.journeyData.inductionDto = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aValidInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should retrieve induction and store in journeyData given different prisoner's induction already in journeyData`, async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.journeyData.inductionDto = aValidInductionDto({ prisonNumber: 'Z1234XY' })

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aValidInductionDto({ prisonNumber })
    inductionService.getInduction.mockResolvedValue(expectedInductionDto)

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it(`should not retrieve induction given prisoner's induction already in journeyData`, async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    const prisonNumber = 'A1234GC'

    req.journeyData.inductionDto = aValidInductionDto({ prisonNumber })

    req.params.prisonNumber = prisonNumber
    const expectedInductionDto = aValidInductionDto({ prisonNumber })

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).not.toHaveBeenCalled()
    expect(req.journeyData.inductionDto).toEqual(expectedInductionDto)
    expect(next).toHaveBeenCalled()
  })

  it('should call next function with error given retrieving induction returns null indicating the prisoner does not have an induction', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.journeyData.inductionDto = undefined

    const prisonNumber = 'A1234GC'
    req.params.prisonNumber = prisonNumber

    inductionService.getInduction.mockResolvedValue(null)
    const expectedError = createError(
      404,
      `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
    )

    // When
    await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.journeyData.inductionDto).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next function with error given retrieving induction fails with a 500', async () => {
    // Given
    const username = 'a-dps-user'
    req.user.username = username

    req.journeyData.inductionDto = undefined

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
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(req.journeyData.inductionDto).toBeUndefined()
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
