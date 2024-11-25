import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's support needs from Curious
 */
const retrieveCuriousSupportNeeds = (curiousService: CuriousService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners functional skills and store in res.locals
    res.locals.prisonerSupportNeeds = await curiousService.getPrisonerSupportNeeds(prisonNumber, req.user.username)

    next()
  })
}
export default retrieveCuriousSupportNeeds
