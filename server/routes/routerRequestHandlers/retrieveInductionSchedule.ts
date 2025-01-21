import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import config from '../../config'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction Schedule from InductionService and store in res.locals
 */
const retrieveInductionSchedule = (inductionService: InductionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    const { activeCaseLoadId } = res.locals.user
    if (config.featureToggles.reviewJourneyEnabledForPrison(activeCaseLoadId)) {
      try {
        // Retrieve the Induction Schedule and store in res.locals
        res.locals.inductionSchedule = {
          problemRetrievingData: false,
          inductionSchedule: await inductionService.getInductionSchedule(prisonNumber, req.user.username),
        }
      } catch (error) {
        res.locals.inductionSchedule = {
          ...gracefullyHandleException(error, prisonNumber),
          inductionSchedule: undefined,
        }
      }
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
    logger.debug(`No Induction Schedule found for prisoner [${prisonNumber}] in Education And Work Plan API`)
    return { problemRetrievingData: false }
  }

  logger.error('Error retrieving Induction Schedule data from Induction Service', error)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default retrieveInductionSchedule
