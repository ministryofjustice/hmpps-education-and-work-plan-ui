import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { InductionService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

/**
 *  Middleware function that returns a Request handler function that checks that the prisoners InductionSchedule is SCHEDULED
 */
const checkInductionIsScheduled = (inductionService: InductionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    let nextErr
    try {
      const inductionSchedule = await inductionService.getInductionSchedule(prisonNumber, req.user.username)
      if (inductionSchedule.scheduleStatus !== InductionScheduleStatusValue.SCHEDULED) {
        nextErr = createError(404, `Induction Schedule for prisoner ${prisonNumber} is not SCHEDULED`)
      }
    } catch (error) {
      nextErr = createError(
        error.status,
        `Education and Work Plan API returned an error in response to getting the Induction Schedule for prisoner ${prisonNumber}`,
      )
    }

    if (nextErr) {
      next(nextErr)
    } else {
      next()
    }
  })
}

export default checkInductionIsScheduled
