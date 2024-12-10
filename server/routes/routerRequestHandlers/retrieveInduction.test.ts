import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import InductionService from '../../services/inductionService'
import retrieveInduction from './retrieveInduction'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../services/inductionService')
describe('retrieveInduction', () => {
  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const requestHandler = retrieveInduction(inductionService)

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

  it('should retrieve Induction and store on res.locals', async () => {
    // Given
    const inductionDto = aValidInductionDto()
    inductionService.getInduction.mockResolvedValue(inductionDto)

    const expected = {
      problemRetrievingData: false,
      inductionDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.induction).toEqual(expected)
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
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
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })

  it('should handle retrieval of Induction given service returns undefined, indicating the prisoner does not have an Induction', async () => {
    // Given
    inductionService.getInduction.mockResolvedValue(undefined)

    const expected = {
      problemRetrievingData: false,
      inductionDto: undefined as InductionDto,
    }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.induction).toEqual(expected)
    expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
