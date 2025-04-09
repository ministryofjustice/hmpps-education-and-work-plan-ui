import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction Schedule from InductionService and store in res.locals
 */
const retrieveInductionSchedule = (inductionService: InductionService): RequestHandler => {
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
