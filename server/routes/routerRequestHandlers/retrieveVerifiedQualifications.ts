import { NextFunction, Request, RequestHandler, Response } from 'express'
import { LearnerRecordsService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's verified qualifications from LRS
 */
const retrieveVerifiedQualifications = (learnerRecordsService: LearnerRecordsService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    const { apiErrorCallback } = res.locals
    res.locals.verifiedQualifications = await Result.wrap(
      learnerRecordsService.getVerifiedQualifications(req.user.username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveVerifiedQualifications
