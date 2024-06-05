import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import InductionService from '../../services/inductionService'
import retrieveInduction from './retrieveInduction'
import { aLongQuestionSetInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../services/inductionService')
describe('retrieveInduction', () => {
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const requestHandler = retrieveInduction(inductionService)

  const prisonNumber = 'A1234BC'
  const userToken = 'a-user-token'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: {
        token: userToken,
      },
      params: { prisonNumber },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should retrieve Induction and store on res.locals', async () => {
    // Given
    const inductionDto = aLongQuestionSetInductionDto()
    inductionService.getInduction.mockResolvedValue(inductionDto)

    const expected = {
      problemRetrievingData: false,
      inductionDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.induction).toEqual(expected)
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Induction given Induction service returns an unexpected error', async () => {
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

    const expected = {
      problemRetrievingData: true,
      inductionDto: undefined as InductionDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.induction).toEqual(expected)
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Induction given Induction service returns Not Found for the Induction', async () => {
    // Given
    const inductionServiceError = {
      status: 404,
      data: {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
        developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
      },
    }
    inductionService.getInduction.mockRejectedValue(inductionServiceError)

    const expected = {
      problemRetrievingData: false,
      inductionDto: undefined as InductionDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.induction).toEqual(expected)
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, userToken)
    expect(next).toHaveBeenCalled()
  })
})
