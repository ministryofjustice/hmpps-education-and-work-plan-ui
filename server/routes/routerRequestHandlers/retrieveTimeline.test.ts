import { Request, Response } from 'express'
import TimelineService from '../../services/timelineService'
import retrieveTimeline from './retrieveTimeline'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'

jest.mock('../../services/timelineService')

describe('retrieveTimeline', () => {
  const timelineService = new TimelineService(null, null, null) as jest.Mocked<TimelineService>
  const requestHandler = retrieveTimeline(timelineService)

  const prisonNumber = 'A1234BC'
  const username = 'testUser'

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

  it('should retrieve Timeline and store on res.locals', async () => {
    // Given
    const timeline = aValidTimeline()
    timelineService.getTimeline.mockResolvedValue(timeline)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.timeline).toEqual(timeline)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(prisonNumber, username)
    expect(next).toHaveBeenCalled()
  })
})
