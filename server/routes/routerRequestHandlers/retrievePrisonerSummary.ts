import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import PrisonerService from '../../services/prisonerService'

/**
 *  Middleware function that returns a Request handler function to look up the prisoner from prisoner-search, map to a PrisonerSummary, and store on res.locals
 */
const retrievePrisonerSummary = (prisonerService: PrisonerService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Lookup the prisoner and store on res.locals
      res.locals.prisonerSummary = await prisonerService.getPrisonerByPrisonNumber(prisonNumber, req.user.username)
      // Set the prisoner summary on req.middleware as well to prevent a 2nd lookup of the prisoner by hmpps-prisoner-permissions-lib
      // TODO - consider moving to req.middleware.prisonData throughout (instead of res.locals.prisonerSummary) to be consistent with other DPS services
      req.middleware = {
        ...req.middleware,
        prisonerData: res.locals.prisonerSummary,
      }

      next()
    } catch (error) {
      next(
        createError(
          error.responseStatus || error.status,
          `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`,
        ),
      )
    }
  }
}
export default retrievePrisonerSummary
