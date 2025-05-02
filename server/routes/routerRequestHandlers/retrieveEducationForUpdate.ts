import { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the prisoner's Education record from
 *  EducationAndWorkPlanService and store in the journeyData if it's not already there.
 *  If the prisoners education record cannot be retrieved an error is thrown which will result in an appropriate error screen.
 */
const retrieveEducationForUpdate = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    if (req.journeyData?.educationDto) {
      return next()
    }

    try {
      // Retrieve the qualifications and store in the prisoner context
      const educationDto = await educationAndWorkPlanService.getEducation(prisonNumber, req.user.username)
      if (educationDto) {
        req.journeyData = { educationDto }
        return next()
      }

      return next(createError(404, `Education for prisoner ${prisonNumber} not returned by the Education Service`))
    } catch (error) {
      return next(
        createError(error.status, `Education for prisoner ${prisonNumber} not returned by the Education Service`),
      )
    }
  })
}

export default retrieveEducationForUpdate
