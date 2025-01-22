import { Request, Response } from 'express'
import InductionService from '../../services/inductionService'
import retrieveInductionSchedule from './retrieveInductionSchedule'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'

jest.mock('../../services/inductionService')

const reviewJourneyEnabledForPrison = jest.fn()
jest.mock('../../config', () => ({
  featureToggles: {
    reviewJourneyEnabledForPrison: (prisonId: string) => reviewJourneyEnabledForPrison(prisonId),
  },
}))

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
        user: { username, activeCaseLoadId: 'BXI' },
      },
    } as unknown as Response
  })

  it('should retrieve Induction Schedule and store on res.locals given prison is enabled for reviews', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(true)

    const inductionSchedule = aValidInductionSchedule()
    inductionService.getInductionSchedule.mockResolvedValue(inductionSchedule)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.inductionSchedule).toEqual(inductionSchedule)
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })

  it('should handle retrieval of Induction given Induction service returns an unexpected error', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(true)

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
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })

  it('should handle retrieval of Induction given Induction service returns Not Found for the Induction', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(true)

    const inductionServiceError = {
      status: 404,
      data: {
        status: 404,
        userMessage: `Induction not found for prisoner [${prisonNumber}]`,
        developerMessage: `Induction not found for prisoner [${prisonNumber}]`,
      },
    }
    inductionService.getInductionSchedule.mockRejectedValue(inductionServiceError)

    const expected = { problemRetrievingData: false }

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.inductionSchedule).toEqual(expected)
    expect(inductionService.getInductionSchedule).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })

  it('should not retrieve Induction Schedule given prison is not enabled for reviews', async () => {
    // Given
    reviewJourneyEnabledForPrison.mockReturnValue(false)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.actionPlanReviews).toEqual(undefined)
    expect(inductionService.getInductionSchedule).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(reviewJourneyEnabledForPrison).toHaveBeenCalledWith('BXI')
  })
})
