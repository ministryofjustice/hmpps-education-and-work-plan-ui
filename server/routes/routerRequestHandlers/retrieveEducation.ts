import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 *  Middleware function that returns a Request handler function to retrieve the qualifications from EducationAndWorkPlanService and store in res.locals
 */
const retrieveEducation = (educationAndWorkPlanService: EducationAndWorkPlanService): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    try {
      // Retrieve the qualifications and store in res.locals
      res.locals.education = {
        problemRetrievingData: false,
        educationDto: await educationAndWorkPlanService.getEducation(prisonNumber, req.user.username),
      }
    } catch (error) {
      logger.debug('Error retrieving Education data', error)
      res.locals.education = { problemRetrievingData: true, educationDto: undefined }
    }

    next()
  })
}

export default retrieveEducation
