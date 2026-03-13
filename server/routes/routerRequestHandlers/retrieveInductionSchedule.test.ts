import { Request, Response } from 'express'
import type { InductionSchedule } from 'viewModels'
import InductionService from '../../services/inductionService'
import retrieveInductionSchedule from './retrieveInductionSchedule'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'

jest.mock('../../services/inductionService')

describe('retrieveInductionSchedule', () => {
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

  describe('retrieve Induction Schedule using the deprecated approach', () => {
    const requestHandler = retrieveInductionSchedule(inductionService, { usingOldStyle: true })

    it('should retrieve Induction Schedule and store on res.locals', async () => {
      // Given
      const inductionSchedule = aValidInductionSchedule()
      inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.inductionSchedule).toEqual(inductionSchedule)
      expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
    })

    it('should handle retrieval of Induction Schedule given Induction service returns an unexpected error', async () => {
      // Given
      const inductionServiceError = {
        status: 500,
        data: {
          status: 500,
          userMessage: 'An unexpected error occurred',
          developerMessage: 'An unexpected error occurred',
        },
      }
      inductionService.getInductionSchedule.mockRejectedValue(inductionServiceError)

      const expected = { problemRetrievingData: true }

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.inductionSchedule).toEqual(expected)
      expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
    })

    it('should handle retrieval of Induction Schedule given Induction service returns empty Induction Schedule indicating Not Found', async () => {
      // Given
      const inductionSchedule = { problemRetrievingData: false } as InductionSchedule
      inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

      const expected = { problemRetrievingData: false }

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.inductionSchedule).toEqual(expected)
      expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
    })
  })

  describe('retrieve Induction Schedule', () => {
    const requestHandler = retrieveInductionSchedule(inductionService)

    it('should retrieve Induction Schedule and store on res.locals', async () => {
      // Given
      const inductionSchedule = aValidInductionSchedule()
      inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.inductionSchedule.isFulfilled()).toEqual(true)
      expect(res.locals.inductionSchedule.value).toEqual(inductionSchedule)
      expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
      expect(apiErrorCallback).not.toHaveBeenCalled()
    })

    it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
      // Given
      const error = new Error('An error occurred')
      inductionService.getInductionSchedule.mockRejectedValue(error)

      // When
      await requestHandler(req, res, next)

      // Then
      expect(res.locals.inductionSchedule.isFulfilled()).toEqual(false)
      expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
      expect(next).toHaveBeenCalled()
      expect(apiErrorCallback).toHaveBeenCalledWith(error)
    })
  })
})
