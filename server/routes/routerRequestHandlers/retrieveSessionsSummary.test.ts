import { Request, Response } from 'express'
import createError from 'http-errors'
import type { SessionsSummary } from 'viewModels'
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
    expect(res.locals.sessionsSummary).toEqual(sessionsSummary)
    expect(sessionService.getSessionsSummary).toHaveBeenCalledWith(activeCaseLoadId, username)
    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with an error given retrieving sessions summary returns a problem retrieving data', async () => {
    // Given
    const sessionsSummary = {
      problemRetrievingData: true,
    } as SessionsSummary
    sessionService.getSessionsSummary.mockResolvedValue(sessionsSummary)

    const expectedError = createError(
      500,
      `Error retrieving Sessions Summary for prison [${activeCaseLoadId}] from Education And Work Plan API`,
    )

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.sessionsSummary).toBeUndefined()
    expect(sessionService.getSessionsSummary).toHaveBeenCalledWith(activeCaseLoadId, username)
    expect(next).toHaveBeenCalledWith(expectedError)
  })
})
