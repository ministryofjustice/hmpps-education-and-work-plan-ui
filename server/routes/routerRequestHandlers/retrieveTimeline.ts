import { NextFunction, Request, RequestHandler, Response } from 'express'
import { startOfToday, subMonths } from 'date-fns'
import { TimelineService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { asArray } from '../../utils/utils'
import TimelineFilterTypeValue from '../../enums/timelineFilterTypeValue'
import { PrisonUser } from '../../interfaces/hmppsUser'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Timeline and store in res.locals
 */
const retrieveTimeline = (timelineService: TimelineService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const user = res.locals.user as PrisonUser
    const { activeCaseLoadId, username } = user
    const sixMonthsAgo = subMonths(startOfToday(), 6)

    const filterOptions = asArray(
      req.query.filterOptions || TimelineFilterTypeValue.ALL,
    ) as Array<TimelineFilterTypeValue>
    const noFiltering = filterOptions.length === 1 && filterOptions.includes(TimelineFilterTypeValue.ALL)

    // Retrieve the timeline and store in res.locals
    res.locals.timeline = await timelineService.getTimeline({
      prisonNumber,
      username,
      filterOptions: noFiltering
        ? {
            inductions: false,
            goals: false,
            reviews: false,
            prisonEvents: false,
            eventsSince: undefined,
            prisonId: undefined,
          }
        : {
            inductions: filterOptions.includes(TimelineFilterTypeValue.INDUCTION),
            goals: filterOptions.includes(TimelineFilterTypeValue.GOALS),
            reviews: filterOptions.includes(TimelineFilterTypeValue.REVIEWS),
            prisonEvents: filterOptions.includes(TimelineFilterTypeValue.PRISON_MOVEMENTS),
            eventsSince: filterOptions.includes(TimelineFilterTypeValue.LAST_6_MONTHS) ? sixMonthsAgo : undefined,
            prisonId: filterOptions.includes(TimelineFilterTypeValue.CURRENT_PRISON) ? activeCaseLoadId : undefined,
          },
    })

    next()
  })
}

export default retrieveTimeline
