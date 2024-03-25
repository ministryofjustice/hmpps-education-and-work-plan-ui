import { NextFunction, Request, RequestHandler, Response } from 'express'
import { CuriousService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner's functional skills from Curious and store in the session
 */
const retrieveFunctionalSkillsIfNotInSession = (curiousService: CuriousService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Lookup the prisoners functional skills and store in the session if its either not there, or is for a different prisoner
    if (
      !req.session.prisonerFunctionalSkills ||
      req.session.prisonerFunctionalSkills.prisonNumber !== prisonNumber ||
      req.session.prisonerFunctionalSkills.problemRetrievingData === true
    ) {
      req.session.prisonerFunctionalSkills = await curiousService.getPrisonerFunctionalSkills(
        prisonNumber,
        req.user.username,
      )
    }
    next()
  }
}
export default retrieveFunctionalSkillsIfNotInSession
