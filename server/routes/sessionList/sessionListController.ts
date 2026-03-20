import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SessionListController {
  getDueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionListSearchResults, searchOptions } = res.locals
    return res.render('pages/sessionList/new_dueSessions', { sessionListSearchResults, searchOptions })
  }

  getOverdueSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionListSearchResults, searchOptions } = res.locals
    return res.render('pages/sessionList/new_overdueSessions', { sessionListSearchResults, searchOptions })
  }

  getOnHoldSessionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionListSearchResults, searchOptions } = res.locals
    return res.render('pages/sessionList/new_onHoldSessions', { sessionListSearchResults, searchOptions })
  }
}
