import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the Additional Learning Needs (ALN) and
 *  Learning Difficulties and Disabilities (LDD) assessments for a given prisoner.
 */
const retrieveCuriousAlnAndLddAssessments = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Retrieve the prisoner's ALN & LDD Assessments from Curious and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.curiousAlnAndLddAssessments = await Result.wrap(
      curiousService.getAlnAndLddAssessments(prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}
export default retrieveCuriousAlnAndLddAssessments
