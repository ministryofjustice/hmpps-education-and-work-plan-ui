import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { EducationAndWorkPlanService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve a single goal by prisonNumber and goalReference, and to store in res.locals
 */
const retrieveGoal = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber, goalReference } = req.params

    // Retrieve the goal by prisonNumber and goalReference and store in res.locals
    const { apiErrorCallback } = res.locals
    const goal = await Result.wrap(
      educationAndWorkPlanService.getPrisonerGoalByReference(prisonNumber, goalReference, req.user.username),
      apiErrorCallback,
    )

    // If the goal is null then return the next route handler as the 404 page
    if (goal.isFulfilled() && goal.getOrNull() === null) {
      return next(createError(404, `Goal [${goalReference}] does not exist in [${prisonNumber}]'s plan`))
    }

    res.locals.goal = goal
    return next()
  }
}

export default retrieveGoal
