import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Result } from '../../utils/result/result'
import { SupportAdditionalNeedsService } from '../../services'

/**
 *  Function that returns a middleware function to retrieve the prisoner's Support Strategies from the SAN API
 */
const retrieveSupportForAdditionalNeedsSupportStrategies = (
  supportAdditionalNeedsService: SupportAdditionalNeedsService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's Support Strategies and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.supportStrategies = await Result.wrap(
      supportAdditionalNeedsService.getSupportStrategies(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSupportForAdditionalNeedsSupportStrategies
