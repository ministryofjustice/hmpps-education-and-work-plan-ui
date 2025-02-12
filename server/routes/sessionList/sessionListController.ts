import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SessionListController {
  getDueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return res.render('pages/sessionList/dueSessions', {})
  }

  getOverdueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return res.render('pages/sessionList/overdueSessions', {})
  }

  getOnHoldSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return res.render('pages/sessionList/onHoldSessions', {})
  }
}
