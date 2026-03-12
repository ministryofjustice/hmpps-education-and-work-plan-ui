import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in res.locals
 */
const retrieveInduction = (
  inductionService: InductionService,
  config: { usingOldStyle: boolean } = { usingOldStyle: false },
): RequestHandler => {
  if (!config.usingOldStyle) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { prisonNumber } = req.params

      const { apiErrorCallback } = res.locals
      res.locals.induction = await Result.wrap(
        inductionService.getInduction(prisonNumber, req.user.username),
        apiErrorCallback,
      )

      return next()
    }
  }

  // @deprecated approach - TODO refactor routes and views that use this approach to use the wrapped promise based approach
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Retrieve the Induction and store in res.locals
      res.locals.induction = {
        problemRetrievingData: false,
        inductionDto: await inductionService.getInduction(prisonNumber, req.user.username),
      }
    } catch (error) {
      logger.error('Error retrieving Induction data from Induction Service', error)
      res.locals.induction = { problemRetrievingData: true }
    }

    next()
  })
}

export default retrieveInduction
