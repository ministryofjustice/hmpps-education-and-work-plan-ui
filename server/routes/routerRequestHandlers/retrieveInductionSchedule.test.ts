import { Request, Response } from 'express'
import type { InductionSchedule } from 'viewModels'
import InductionService from '../../services/inductionService'
import retrieveInductionSchedule from './retrieveInductionSchedule'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import config from '../../config'

jest.mock('../../services/inductionService')
jest.mock('../../config')

describe('retrieveInductionSchedule', () => {
  const inductionService = new InductionService(null, null) as jest.Mocked<InductionService>
  const requestHandler = retrieveInductionSchedule(inductionService)

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
      locals: {
        user: { username },
      },
    } as unknown as Response
  })

  it('should retrieve Induction Schedule and store on res.locals given review journey is enabled', async () => {
    // Given
    config.featureToggles.reviewsEnabled = true

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
    config.featureToggles.reviewsEnabled = true

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
    config.featureToggles.reviewsEnabled = true

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

  it('should not retrieve Induction Schedule given reviews journey is not enabled', async () => {
    // Given
    config.featureToggles.reviewsEnabled = false

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.actionPlanReviews).toEqual(undefined)
    expect(inductionService.getInductionSchedule).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
