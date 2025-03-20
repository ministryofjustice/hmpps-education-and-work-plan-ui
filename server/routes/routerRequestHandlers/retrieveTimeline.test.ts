import { Request, Response } from 'express'
import TimelineService from '../../services/timelineService'
import retrieveTimeline from './retrieveTimeline'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import TimelineFilterTypeValue from '../../enums/timelineFilterTypeValue'

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
      query: {},
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
  })

  it('should retrieve Timeline and store on res.locals given no filter options on the query string', async () => {
    // Given
    req.query = {}

    const expectedFilterOptions = [TimelineFilterTypeValue.ALL]

    const timeline = aValidTimeline({ filteredBy: expectedFilterOptions })
    timelineService.getTimeline.mockResolvedValue(timeline)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.timeline).toEqual(timeline)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(prisonNumber, expectedFilterOptions, username)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve Timeline and store on res.locals given some filter options on the query string', async () => {
    // Given
    req.query = {
      filterOptions: [TimelineFilterTypeValue.GOALS, TimelineFilterTypeValue.REVIEWS],
    }

    const expectedFilterOptions = [TimelineFilterTypeValue.GOALS, TimelineFilterTypeValue.REVIEWS]

    const timeline = aValidTimeline({ filteredBy: expectedFilterOptions })
    timelineService.getTimeline.mockResolvedValue(timeline)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.timeline).toEqual(timeline)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(prisonNumber, expectedFilterOptions, username)
    expect(next).toHaveBeenCalled()
  })
})
