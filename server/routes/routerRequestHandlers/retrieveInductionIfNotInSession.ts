import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in the session
 */
const retrieveInductionIfNotInSession = (inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      // Retrieve the Induction and store in the session if its either not there, or is for a different prisoner
      if (!req.session.inductionDto || req.session.inductionDto.prisonNumber !== prisonNumber) {
        req.session.inductionDto = await inductionService.getInduction(prisonNumber, req.user.token)
      }
      next()
    } catch (error) {
      next(createError(error.status, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`))
    }
  }
}
export default retrieveInductionIfNotInSession
