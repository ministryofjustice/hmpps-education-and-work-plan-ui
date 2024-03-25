import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import PrisonerSearchService from '../../services/prisonerSearchService'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner from prisoner-search, map to a PrisonerSummary, and store in the session
 */
const retrievePrisonerSummaryIfNotInSession = (prisonerSearchService: PrisonerSearchService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Lookup the prisoner and store in the session if its either not there, or is for a different prisoner
      if (!req.session.prisonerSummary || req.session.prisonerSummary.prisonNumber !== prisonNumber) {
        req.session.prisonerSummary = await prisonerSearchService.getPrisonerByPrisonNumber(
          prisonNumber,
          req.user.username,
        )
      }
      next()
    } catch (error) {
      next(createError(error.status, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`))
    }
  }
}
export default retrievePrisonerSummaryIfNotInSession
