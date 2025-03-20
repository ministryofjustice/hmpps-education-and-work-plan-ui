import { NextFunction, Request, RequestHandler, Response } from 'express'
import { TimelineService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { asArray } from '../../utils/utils'
import TimelineFilterTypeValue from '../../enums/timelineFilterTypeValue'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Timeline and store in res.locals
 */
const retrieveTimeline = (timelineService: TimelineService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    const filterOptions = asArray(
      req.query.filterOptions || TimelineFilterTypeValue.ALL,
    ) as Array<TimelineFilterTypeValue>

    // Retrieve the timeline and store in res.locals
    res.locals.timeline = await timelineService.getTimeline(prisonNumber, filterOptions, req.user.username)

    next()
  })
}

export default retrieveTimeline
