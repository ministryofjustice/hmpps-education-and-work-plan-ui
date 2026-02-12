import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to retrieve the qualifications from EducationAndWorkPlanService and store in res.locals
 */
const retrieveEducation = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Retrieve the qualifications and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.education = await Result.wrap(
      educationAndWorkPlanService.getEducation(prisonNumber, req.user.username),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveEducation
