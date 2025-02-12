import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SessionService from '../../services/sessionService'

/**
 *  Middleware function that returns a Request handler function to retrieve the Sessions Summary for the user's active caseload from SessionService and store in res.locals
 */
const retrieveSessionsSummary = (sessionService: SessionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve the Sessions Summary for the user's active caseload and store in res.locals
    const {
      user: { activeCaseLoadId, username },
    } = res.locals

    const sessionsSummary = await sessionService.getSessionsSummary(activeCaseLoadId, username)
    if (!sessionsSummary.problemRetrievingData) {
      res.locals.sessionsSummary = sessionsSummary
      return next()
    }

    return next(
      createError(
        500,
        `Error retrieving Sessions Summary for prison [${activeCaseLoadId}] from Education And Work Plan API`,
      ),
    )
  })
}

export default retrieveSessionsSummary
