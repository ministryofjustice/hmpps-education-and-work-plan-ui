import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import GoalStatusValue from '../../enums/goalStatusValue'

/**
 *  Middleware function that returns a Request handler function to retrieve the goals by status from EducationAndWorkPlanService and store in res.locals
 */
const retrieveGoals = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const status: GoalStatusValue = req.query.status as GoalStatusValue

    try {
      // Retrieve the goals by status and store in res.locals
      res.locals.goals = {
        problemRetrievingData: false,
        goals: await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, req.user.username),
      }
    } catch (error) {
      res.locals.goals = { ...gracefullyHandleException(error, prisonNumber), goals: undefined }
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
    logger.info(
      `No Goals found for prisoner [${prisonNumber}] with status [${error.status}] in Education And Work Plan API`,
    )
    return { problemRetrievingData: false }
  }

  logger.error('Error retrieving Goals data', error)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default retrieveGoals
