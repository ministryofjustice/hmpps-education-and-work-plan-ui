import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's support needs from Curious
 */
const retrieveCuriousSupportNeeds = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners support needs and store in res.locals
    const { apiErrorCallback } = res.locals
    res.locals.prisonerSupportNeeds = await Result.wrap(
      curiousService.getPrisonerSupportNeeds(prisonNumber),
      apiErrorCallback,
    )

    return next()
  }
}
export default retrieveCuriousSupportNeeds
