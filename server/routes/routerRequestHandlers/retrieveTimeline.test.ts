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
  const activeCaseLoadId = 'BXI'

  let req: Request
  let res: Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      params: { prisonNumber },
      query: {},
    } as unknown as Request
    res = {
      locals: {
        user: { username, activeCaseLoadId },
      },
    } as unknown as Response
  })

  it('should retrieve Timeline and store on res.locals given no filter options on the query string', async () => {
    // Given
    req.query = {}

    const expectedFilterOptions = {
      prisonNumber,
      username,
      filterOptions: {
        goals: false,
        inductions: false,
        prisonEvents: false,
        reviews: false,
        prisonId: undefined as string,
        eventsSince: undefined as Date,
      },
    }

    const timeline = aValidTimeline({ filteredBy: [TimelineFilterTypeValue.ALL] })
    timelineService.getTimeline.mockResolvedValue(timeline)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.timeline).toEqual(timeline)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(expectedFilterOptions)
    expect(next).toHaveBeenCalled()
  })

  it('should retrieve Timeline and store on res.locals given some filter options on the query string', async () => {
    // Given
    req.query = {
      filterOptions: [TimelineFilterTypeValue.GOALS, TimelineFilterTypeValue.REVIEWS],
    }

    const expectedFilterOptions = {
      prisonNumber,
      username,
      filterOptions: {
        goals: true,
        inductions: false,
        prisonEvents: false,
        reviews: true,
        prisonId: undefined as string,
        eventsSince: undefined as Date,
      },
    }

    const timeline = aValidTimeline({ filteredBy: [TimelineFilterTypeValue.GOALS, TimelineFilterTypeValue.REVIEWS] })
    timelineService.getTimeline.mockResolvedValue(timeline)

    // When
    await requestHandler(req, res, next)

    // Then
    expect(res.locals.timeline).toEqual(timeline)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(expectedFilterOptions)
    expect(next).toHaveBeenCalled()
  })
})
