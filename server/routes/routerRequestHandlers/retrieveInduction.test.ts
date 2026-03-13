import { Request, Response } from 'express'
import type { InductionDto } from 'inductionDto'
import InductionService from '../../services/inductionService'
import retrieveInduction from './retrieveInduction'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'

jest.mock('../../services/inductionService')
describe('retrieveInduction', () => {
  const inductionService = new InductionService(null) as jest.Mocked<InductionService>

  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'

  const apiErrorCallback = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    locals: { apiErrorCallback },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('retrieve induction using the deprecated approach', () => {
    const requestHandler = retrieveInduction(inductionService, { usingOldStyle: true })

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

    it('should handle retrieval of Induction given Induction service returns null indicating Not Found for the Induction', async () => {
      // Given
      inductionService.getInduction.mockResolvedValue(null)

      const expected = {
        problemRetrievingData: false,
        inductionDto: null as InductionDto,
      }

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.induction).toEqual(expected)
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('retrieve induction', () => {
    const requestHandler = retrieveInduction(inductionService)

    it('should retrieve Induction and store on res.locals', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionService.getInduction.mockResolvedValue(inductionDto)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.induction.isFulfilled()).toEqual(true)
      expect(res.locals.induction.value).toEqual(inductionDto)
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
      expect(apiErrorCallback).not.toHaveBeenCalled()
    })

    it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
      // Given
      const error = new Error('An error occurred')
      inductionService.getInduction.mockRejectedValue(error)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.induction.isFulfilled()).toEqual(false)
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
      expect(apiErrorCallback).toHaveBeenCalledWith(error)
    })
  })
})
