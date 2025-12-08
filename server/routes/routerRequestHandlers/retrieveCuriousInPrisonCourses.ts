import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's In Prison Courses from Curious
 */
const retrieveCuriousInPrisonCourses = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners In Prison Courses and store in res.locals
    res.locals.curiousInPrisonCourses = await Result.wrap(
      curiousService.getPrisonerInPrisonCourses(prisonNumber, req.user.username),
    )

    return next()
  }
}
export default retrieveCuriousInPrisonCourses
