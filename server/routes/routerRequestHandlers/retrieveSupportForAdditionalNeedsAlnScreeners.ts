import { NextFunction, Request, RequestHandler, Response } from 'express'
import { SupportAdditionalNeedsService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Function that returns a middleware function to retrieve the prisoner's ALN Screeners from SAN API
 */
const retrieveSupportForAdditionalNeedsAlnScreeners = (
  supportAdditionalNeedsService: SupportAdditionalNeedsService,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    const { username } = req.user

    // Lookup the prisoner's ALN Screeners and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.alnScreeners = await Result.wrap(
      supportAdditionalNeedsService.getAlnScreeners(username, prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}

export default retrieveSupportForAdditionalNeedsAlnScreeners
