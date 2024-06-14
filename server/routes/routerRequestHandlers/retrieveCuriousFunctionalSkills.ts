import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's functional skills from Curious
 */
const retrieveCuriousFunctionalSkills = (curiousService: CuriousService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners functional skills and store in res.locals
    res.locals.prisonerFunctionalSkills = await curiousService.getPrisonerFunctionalSkills(
      prisonNumber,
      req.user.username,
    )

    next()
  })
}
export default retrieveCuriousFunctionalSkills
