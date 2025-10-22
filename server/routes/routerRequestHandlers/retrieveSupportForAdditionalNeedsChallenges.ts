import { NextFunction, Request, RequestHandler, Response } from 'express'
import { SupportAdditionalNeedsService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's challenges from SAN API
 */
const retrieveSupportForAdditionalNeedsChallenges = (
  supportAdditionalNeedsService: SupportAdditionalNeedsService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    const { apiErrorCallback } = res.locals
    res.locals.challenges = await Result.wrap(
      supportAdditionalNeedsService.getChallenges(req.user.username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSupportForAdditionalNeedsChallenges
