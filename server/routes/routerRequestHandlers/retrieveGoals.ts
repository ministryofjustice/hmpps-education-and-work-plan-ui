import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import GoalStatusValue from '../../enums/goalStatusValue'

/**
 *  Middleware function that returns a Request handler function to retrieve the goals by status from EducationAndWorkPlanService and store in res.locals
 */
const retrieveGoals = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const status: GoalStatusValue = req.query.status as GoalStatusValue

    // Retrieve the goals by status and store in res.locals
    res.locals.goals = await educationAndWorkPlanService.getGoalsByStatus(prisonNumber, status, req.user.username)
    next()
  })
}

export default retrieveGoals
