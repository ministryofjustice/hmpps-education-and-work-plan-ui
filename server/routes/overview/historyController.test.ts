import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import aValidTimeline from '../../testsupport/timelineTestDataBuilder'
import HistoryController from './historyController'
import prepareTimelineForView from './prepareTimelineForView'

describe('historyController', () => {
  const controller = new HistoryController()

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

  it('should get history view', async () => {
    // Given
    const expectedTab = 'history'
    req.params.tab = expectedTab

    const expectedTimeline = prepareTimelineForView(timeline)

    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      timeline: expectedTimeline,
    }

    // When
    await controller.getHistoryView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
