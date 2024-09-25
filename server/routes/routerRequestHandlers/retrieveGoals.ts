import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the goals from EducationAndWorkPlanService and store in res.locals
 */
const retrieveGoals = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Retrieve the goals and store in res.locals
    res.locals.goals = await educationAndWorkPlanService.getGoals(prisonNumber, req.user.username)

    next()
  })
}

export default retrieveGoals
