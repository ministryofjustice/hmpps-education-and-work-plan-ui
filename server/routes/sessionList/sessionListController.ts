import { NextFunction, Request, RequestHandler, Response } from 'express'
import SessionSummaryView from '../sessionSummary/sessionSummaryView'

export default class SessionListController {
  getDueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionsSummary } = res.locals
    const view = new SessionSummaryView(sessionsSummary)
    return res.render('pages/sessionList/dueSessions', { ...view.renderArgs })
  }

  getOverdueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionsSummary } = res.locals
    const view = new SessionSummaryView(sessionsSummary)
    return res.render('pages/sessionList/overdueSessions', { ...view.renderArgs })
  }

  getOnHoldSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionsSummary } = res.locals
    const view = new SessionSummaryView(sessionsSummary)
    return res.render('pages/sessionList/onHoldSessions', { ...view.renderArgs })
  }
}
