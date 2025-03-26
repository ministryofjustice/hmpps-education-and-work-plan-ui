import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in the Prisoner Context
 */
const retrieveInductionIfNotInPrisonerContext = (inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Happy path - Call next if the Induction on the session is for the requested prisoner
    if (getPrisonerContext(req.session, prisonNumber).inductionDto?.prisonNumber === prisonNumber) {
      return next()
    }

    // There is either no Induction on the session, or it is for a different prisoner. Retrieve and store in the session
    try {
      const inductionDto = await inductionService.getInduction(prisonNumber, req.user.username)
      if (inductionDto) {
        getPrisonerContext(req.session, prisonNumber).inductionDto = inductionDto
        return next()
      }

      // Sad path, prisoner does not have an Induction yet
      return next(createError(404, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`))
    } catch (error) {
      return next(
        createError(error.status, `Induction for prisoner ${prisonNumber} not returned by the Induction Service`),
      )
    }
  }
}

export default retrieveInductionIfNotInPrisonerContext
