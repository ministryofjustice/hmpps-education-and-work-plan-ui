import { NextFunction, Request, RequestHandler, Response } from 'express'
import { TimelineService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Timeline and store in res.locals
 */
const retrieveTimeline = (timelineService: TimelineService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Retrieve the timeline and store in res.locals
    res.locals.timeline = await timelineService.getTimeline(prisonNumber, req.user.username)

    next()
  })
}

export default retrieveTimeline
