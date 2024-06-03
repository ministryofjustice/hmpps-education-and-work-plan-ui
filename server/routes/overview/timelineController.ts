import { RequestHandler } from 'express'
import filterTimelineEvents from '../timelineResolver'
import TimelineView from './timelineView'
import TimelineService from '../../services/timelineService'

export default class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  getTimelineView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allTimelineEvents = await this.timelineService.getTimeline(prisonNumber, req.user.token, req.user.username)
    const timeline = filterTimelineEvents(allTimelineEvents)
    const view = new TimelineView(prisonerSummary, timeline)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
