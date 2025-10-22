import { NextFunction, Request, RequestHandler, Response } from 'express'
import { SupportAdditionalNeedsService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Strengths from the SAN API
 */
const retrieveSupportForAdditionalNeedsStrengths = (
  supportAdditionalNeedsService: SupportAdditionalNeedsService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Strengths and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.strengths = await Result.wrap(
      supportAdditionalNeedsService.getStrengths(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSupportForAdditionalNeedsStrengths
