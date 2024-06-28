import { Request, Response } from 'express'
import type { Timeline } from 'viewModels'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import TimelineService from '../../services/timelineService'
import TimelineController from './timelineController'
import prepareTimelineForView from './prepareTimelineForView'

jest.mock('../../services/timelineService')

describe('timelineController', () => {
  const timelineService = new TimelineService(null, null) as jest.Mocked<TimelineService>
  const controller = new TimelineController(timelineService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  const res = {
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      session: { prisonerSummary },
      user: {
        username: 'a-dps-user',
        token: 'a-user-token',
      },
      params: { prisonNumber },
    } as unknown as Request
  })

  it('should get timeline view', async () => {
    // Given
    const expectedTab = 'timeline'
    req.params.tab = expectedTab

    const timeline: Timeline = aValidTimeline()
    timelineService.getTimeline.mockResolvedValue(timeline)

    const expectedTimeline = prepareTimelineForView(timeline)

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      timeline: expectedTimeline,
    }

    // When
    await controller.getTimelineView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
    expect(timelineService.getTimeline).toHaveBeenCalledWith(prisonNumber, 'a-user-token', 'a-dps-user')
  })
})
