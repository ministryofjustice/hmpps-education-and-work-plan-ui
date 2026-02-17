import { Request, Response } from 'express'
import SessionService from '../../services/sessionService'
import retrieveSessionsSummary from './retrieveSessionsSummary'
import aValidSessionsSummary from '../../testsupport/sessionsSummaryTestDataBuilder'

jest.mock('../../services/sessionService')

describe('retrieveSessionsSummary', () => {
  const sessionService = new SessionService(null) as jest.Mocked<SessionService>
  const requestHandler = retrieveSessionsSummary(sessionService)

  const username = 'a-dps-user'
  const activeCaseLoadId = 'BXI'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {} as unknown as Request
    res = {
      locals: {
        user: {
          username,
          activeCaseLoadId,
        },
      },
    } as unknown as Response
  })

  it('should retrieve sessions summary and call next', async () => {
    // Given
    const sessionsSummary = aValidSessionsSummary()
    sessionService.getSessionsSummary.mockResolvedValue(sessionsSummary)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.sessionsSummary.isFulfilled()).toEqual(true)
    expect(res.locals.sessionsSummary.value).toEqual(sessionsSummary)
    expect(sessionService.getSessionsSummary).toHaveBeenCalledWith(activeCaseLoadId, username)
    expect(next).toHaveBeenCalled()
  })

  it('should store un-fulfilled promise on res.locals given service returns an error', async () => {
    // Given
    const error = new Error('An error occurred')
    sessionService.getSessionsSummary.mockRejectedValue(error)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.sessionsSummary.isFulfilled()).toEqual(false)
    expect(sessionService.getSessionsSummary).toHaveBeenCalledWith(activeCaseLoadId, username)
    expect(next).toHaveBeenCalled()
  })
})
