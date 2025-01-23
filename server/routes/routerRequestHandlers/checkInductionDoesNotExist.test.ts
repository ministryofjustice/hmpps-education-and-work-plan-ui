import { Request, Response } from 'express'
import createError from 'http-errors'
import InductionService from '../../services/inductionService'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import checkInductionDoesNotExist from './checkInductionDoesNotExist'

jest.mock('../../services/inductionService')

describe('checkInductionDoesNotExist', () => {
  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const requestHandler = checkInductionDoesNotExist(inductionService)

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { username },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should call next with no arguments given prisoner does not have an Induction', async () => {
    // Given
    const inductionServiceResponse = {
      status: 404,
      data: {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
        developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
      },
    }
    inductionService.getInduction.mockRejectedValue(inductionServiceResponse)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with an error given prisoner has an Induction', async () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionService.getInduction.mockResolvedValue(inductionDto)

    const expectedError = createError(404, 'Induction for prisoner A1234BC already exists')

    // When
    await requestHandler(req, res, next)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })

  it('should call next with an error given Induction service returns an unexpected error', async () => {
    // Given
    const inductionServiceError = {
      status: 500,
      data: {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      },
    }
    inductionService.getInduction.mockRejectedValue(inductionServiceError)

    const expectedError = createError(
      500,
      'Education and Work Plan API returned an error in response to getting the Induction for prisoner A1234BC',
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
