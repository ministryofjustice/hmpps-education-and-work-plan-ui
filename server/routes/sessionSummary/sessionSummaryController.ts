import { NextFunction, Request, RequestHandler, Response } from 'express'
import SessionSummaryView from './sessionSummaryView'

export default class SessionSummaryController {
  getSessionSummaryView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const view = new SessionSummaryView()
    return res.render('pages/sessionSummary/index', { ...view.renderArgs })
  }
}
