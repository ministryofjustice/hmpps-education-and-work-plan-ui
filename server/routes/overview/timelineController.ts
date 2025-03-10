import { RequestHandler } from 'express'
import TimelineView from './timelineView'

export default class TimelineController {
  getTimelineView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, timeline } = res.locals

    const view = new TimelineView(prisonerSummary, timeline)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
