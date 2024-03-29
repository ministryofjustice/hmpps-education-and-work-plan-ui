import type { InPrisonCourseRecords } from 'viewModels'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's In Prison Courses from Curious
 */
const retrieveCuriousInPrisonCourses = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners In Prison Courses and store in res.locals if its either not there, or is for a different prisoner
    const curiousInPrisonCourses = res.locals.curiousInPrisonCourses as InPrisonCourseRecords
    if (
      !curiousInPrisonCourses ||
      curiousInPrisonCourses.prisonNumber !== prisonNumber ||
      curiousInPrisonCourses.problemRetrievingData === true
    ) {
      res.locals.curiousInPrisonCourses = await curiousService.getPrisonerInPrisonCourses(
        prisonNumber,
        req.user.username,
      )
    }
    next()
  }
}
export default retrieveCuriousInPrisonCourses
