import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import GoalStatusValue from '../../enums/goalStatusValue'

const retrieveGoals = (
  educationAndWorkPlanService: EducationAndWorkPlanService,
  status: GoalStatusValue,
): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    res.locals.problemRetrievingData = false

    try {
      const allGoalsResponse = await educationAndWorkPlanService.getAllGoals(prisonNumber, req.user.token)
      const allGoals = allGoalsResponse.goals || []
      const activeGoals = allGoals.filter(goal => goal.status === GoalStatusValue.ACTIVE)
      const archivedGoals = allGoals.filter(goal => goal.status === GoalStatusValue.ARCHIVED)

      res.locals.inProgressGoalsCount = activeGoals.length
      res.locals.archivedGoalsCount = archivedGoals.length
      res.locals.goals = status === GoalStatusValue.ACTIVE ? activeGoals : archivedGoals
      res.locals.problemRetrievingData = allGoalsResponse.problemRetrievingData
    } catch (error) {
      res.locals.goals = { ...gracefullyHandleException(error, prisonNumber), goals: undefined }
    }

    next()
  })
}

/**
 * Gracefully handle an exception thrown from the EducationAndWorkPlanClient by returning:
 *   * { problemRetrievingData: false } if it was a 404 error (the data simply doesn't exist)
 *   * { problemRetrievingData: true } for any other status code, indicating a more serious error
 */
const gracefullyHandleException = (
  error: { status: number },
  prisonNumber: string,
): { problemRetrievingData: boolean } => {
  if (isNotFoundError(error)) {
    logger.info(`No goals found for prisoner [${prisonNumber}] in Education And Work Plan API`)
    return { problemRetrievingData: false }
  }

  logger.error('Error retrieving goals', error)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default retrieveGoals
