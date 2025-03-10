import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import TimelineController from './timelineController'
import prepareTimelineForView from './prepareTimelineForView'

describe('timelineController', () => {
  const controller = new TimelineController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const timeline = aValidTimeline({ prisonNumber })

  const req = {
    user: { username: 'a-dps-user' },
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, timeline },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get timeline view', async () => {
    // Given
    const expectedTab = 'timeline'
    req.params.tab = expectedTab

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
  })
})
