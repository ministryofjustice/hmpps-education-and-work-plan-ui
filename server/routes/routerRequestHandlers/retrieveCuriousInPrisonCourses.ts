import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's In Prison Courses from Curious
 */
const retrieveCuriousInPrisonCourses = (curiousService: CuriousService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners In Prison Courses and store in res.locals
    res.locals.curiousInPrisonCourses = await curiousService.getPrisonerInPrisonCourses(prisonNumber, req.user.username)

    next()
  })
}
export default retrieveCuriousInPrisonCourses
