import { NextFunction, Request, RequestHandler, Response } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import ReviewService from '../../services/reviewService'

/**
 *  Middleware function that returns a Request handler function to retrieve the Action Plan Reviews from ReviewService and store in res.locals
 */
const retrieveActionPlanReviews = (reviewService: ReviewService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Retrieve the Action Plan Reviews and store in res.locals
    res.locals.actionPlanReviews = await reviewService.getActionPlanReviews(prisonNumber, req.user.username)

    next()
  })
}

export default retrieveActionPlanReviews
