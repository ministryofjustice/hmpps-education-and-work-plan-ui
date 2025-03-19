import { RequestHandler } from 'express'
import HistoryView from './historyView'

export default class HistoryController {
  getHistoryView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, timeline } = res.locals

    const view = new HistoryView(prisonerSummary, timeline)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
