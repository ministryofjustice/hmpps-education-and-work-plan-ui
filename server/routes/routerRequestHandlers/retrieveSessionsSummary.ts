import { NextFunction, Request, RequestHandler, Response } from 'express'
import SessionService from '../../services/sessionService'
import { Result } from '../../utils/result/result'
import { PrisonUser } from '../../interfaces/hmppsUser'

/**
 *  Middleware function that returns a Request handler function to retrieve the Sessions Summary for the user's active caseload from SessionService and store in res.locals
 */
const retrieveSessionsSummary = (sessionService: SessionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the Sessions Summary for the user's active caseload and store in res.locals
    const user = res.locals.user as PrisonUser
    const { activeCaseLoadId, username } = user

    const { apiErrorCallback } = res.locals
    res.locals.sessionsSummary = await Result.wrap(
      sessionService.getSessionsSummary(activeCaseLoadId, username),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSessionsSummary
