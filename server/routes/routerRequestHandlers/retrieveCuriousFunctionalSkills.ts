import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'
import { Result } from '../../utils/result/result'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's functional skills from Curious
 */
const retrieveCuriousFunctionalSkills = (
  curiousService: CuriousService,
  options: { useCurious1ApiForFunctionalSkills: boolean } = { useCurious1ApiForFunctionalSkills: false },
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners functional skills and store in res.locals
    res.locals.prisonerFunctionalSkills = await Result.wrap(
      curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username, options),
    )

    return next()
  }
}
export default retrieveCuriousFunctionalSkills
