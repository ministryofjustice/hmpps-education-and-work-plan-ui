import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in the session
 */
const retrieveInductionIfNotInSession = (inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    if (req.session.inductionDto?.prisonNumber === prisonNumber) {
      return next()
    }

    try {
      // Retrieve the Induction and store in the session
      const induction = await inductionService.getInduction(prisonNumber, req.user.username)
      if (!induction) {
        return next(createError(404, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`))
      }

      req.session.inductionDto = induction
      return next()
    } catch (error) {
      return next(
        createError(error.status, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`),
      )
    }
  }
}

export default retrieveInductionIfNotInSession
