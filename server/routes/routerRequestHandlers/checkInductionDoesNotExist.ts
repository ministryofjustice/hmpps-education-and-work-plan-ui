import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { InductionService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function that checks the given prisoner does not already have an Induction
 */
const checkInductionDoesNotExist = (inductionService: InductionService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    try {
      await inductionService.getInduction(prisonNumber, req.user.username)
      // Sad path - if an Induction was returned it means the prisoner already has an Induction
      next(createError(404, `Induction for prisoner ${prisonNumber} already exists`))
    } catch (error) {
      if (isNotFoundError(error)) {
        // Happy path - a 404/NotFound error means the prisoner does not have an Induction, which is what we are checking for.
        next()
      } else {
        // Any other error (eg: 500) means the API errored for some reason. It means we cannot definitely say whether the prisoner has an Induction or not. Err on the side of caution and return an error
        next(
          createError(
            error.status,
            `Education and Work Plan API returned an error in response to getting the Induction for prisoner ${prisonNumber}`,
          ),
        )
      }
    }
  })
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default checkInductionDoesNotExist
