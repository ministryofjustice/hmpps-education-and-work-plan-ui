import createError from 'http-errors'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { InductionService } from '../../services'

/**
 *  Middleware function that returns a Request handler function to retrieve the Induction from InductionService and store in the journeyData
 */
const retrieveInductionIfNotInJourneyData = (inductionService: InductionService): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Happy path - Call next if the Induction on the journeyData is for the requested prisoner
    if (req.journeyData?.inductionDto?.prisonNumber === prisonNumber) {
      return next()
    }

    // There is either no Induction in the journeyData, or it is for a different prisoner. Retrieve and store in the journeyData
    try {
      const inductionDto = await inductionService.getInduction(prisonNumber, req.user.username)
      if (inductionDto) {
        req.journeyData = { inductionDto }
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

export default retrieveInductionIfNotInJourneyData
