import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Action Plan and store in res.locals
 */
const retrieveActionPlan = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoner's goals and store in res.locals
    res.locals.actionPlan = await educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.username)

    next()
  })
}
export default retrieveActionPlan
