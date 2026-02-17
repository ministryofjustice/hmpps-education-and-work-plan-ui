import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SessionSummaryController {
  getSessionSummaryView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionsSummary } = res.locals
    return res.render('pages/sessionSummary/index', { sessionsSummary })
  }
}
