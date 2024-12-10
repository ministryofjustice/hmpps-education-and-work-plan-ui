import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in res.locals
 */
const retrieveInduction = (inductionService: InductionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Retrieve the Induction and store in res.locals
      res.locals.induction = {
        problemRetrievingData: false,
        inductionDto: await inductionService.getInduction(prisonNumber, req.user.username),
      }
    } catch (error) {
      logger.debug('Error retrieving Induction', error)
      res.locals.induction = { problemRetrievingData: true, inductionDto: undefined }
    }

    next()
  })
}

export default retrieveInduction
