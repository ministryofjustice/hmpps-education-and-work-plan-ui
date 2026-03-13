import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction Schedule from InductionService and store in res.locals
 */
const retrieveInductionSchedule = (
  inductionService: InductionService,
  config: { usingOldStyle: boolean } = { usingOldStyle: false },
): RequestHandler => {
  if (!config.usingOldStyle) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { prisonNumber } = req.params

      const { apiErrorCallback } = res.locals
      res.locals.inductionSchedule = await Result.wrap(
        inductionService.getInductionSchedule(prisonNumber, req.user.username),
        apiErrorCallback,
      )

      return next()
    }
  }

  // @deprecated approach - TODO refactor routes and views that use this approach to use the wrapped promise based approach
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Retrieve the Induction Schedule and store in res.locals
      res.locals.inductionSchedule = await inductionService.getInductionSchedule(prisonNumber, req.user.username)
    } catch (error) {
      logger.error('Error retrieving Induction Schedule data from Induction Service', error)
      res.locals.inductionSchedule = { problemRetrievingData: true }
    }

    next()
  })
}

export default retrieveInductionSchedule
