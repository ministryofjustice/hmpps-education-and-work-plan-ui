import { NextFunction, Request, RequestHandler, Response } from 'express'
import SessionService from '../../services/sessionService'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve the Sessions Summary for the user's active caseload from SessionService and store in res.locals
 */
const retrieveSessionsSummary = (sessionService: SessionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the Sessions Summary for the user's active caseload and store in res.locals
    const {
      user: { activeCaseLoadId, username },
    } = res.locals

    const { apiErrorCallback } = res.locals
    res.locals.sessionsSummary = await Result.wrap(
      sessionService.getSessionsSummary(activeCaseLoadId, username),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSessionsSummary
