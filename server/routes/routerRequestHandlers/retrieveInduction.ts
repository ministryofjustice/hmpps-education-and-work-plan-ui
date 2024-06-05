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
        inductionDto: await inductionService.getInduction(prisonNumber, req.user.token),
      }
    } catch (error) {
      res.locals.induction = { ...gracefullyHandleException(error, prisonNumber), inductionDto: undefined }
    }

    next()
  })
}

/**
 * Gracefully handle an exception thrown from the educationAndWorkPlanClient by returning an object of
 *   * { problemRetrievingData: false } if it was a 404 error (there was no problem retrieving data; it's just the data didn't exist)
 *   * { problemRetrievingData: true } if it was any other status code, indicating a more serious error and problem retrieving the data from the API
 */
const gracefullyHandleException = (
  error: { status: number },
  prisonNumber: string,
): { problemRetrievingData: boolean } => {
  if (isNotFoundError(error)) {
    logger.info(`No Induction found for prisoner [${prisonNumber}] in Education And Work Plan API`)
    return { problemRetrievingData: false }
  }

  logger.error('Error retrieving Induction data from Induction Service', error)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default retrieveInduction
