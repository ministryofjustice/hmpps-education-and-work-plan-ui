import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import getPrisonerContext from '../../data/session/prisonerContexts'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Education record from
 *  EducationAndWorkPlanService and store in the prisoner context if it's not already there for the prisoner.
 *  If the prisoners education record cannot be retrieved an error is thrown which will result in an appropriate error screen.
 */
const retrieveEducationForUpdate = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    try {
      if (!getPrisonerContext(req.session, prisonNumber).educationDto) {
        // Retrieve the qualifications and store in the prisoner context
        getPrisonerContext(req.session, prisonNumber).educationDto = await educationAndWorkPlanService.getEducation(
          prisonNumber,
          req.user.username,
        )
      }
      next()
    } catch (error) {
      next(createError(error.status, `Education for prisoner ${prisonNumber} not returned by the Education Service`))
    }
  })
}

export default retrieveEducationForUpdate
