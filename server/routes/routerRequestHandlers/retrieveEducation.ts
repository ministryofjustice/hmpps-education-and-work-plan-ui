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
        educationDto: await educationAndWorkPlanService.getEducation(prisonNumber, req.user.token),
      }
    } catch (error) {
      res.locals.education = { ...gracefullyHandleException(error, prisonNumber), educationDto: undefined }
    }

    next()
  })
}

/**
 * Gracefully handle an exception thrown from the educationAndWorkPlanClient by returning an object of
 *   * { problemRetrievingData: false } if it was a 404 error (there was no problem retrieving data; it's just the data didn't exist)
 *   * { problemRetrievingData: true } if it was any other status code, indicating a more serious error and problem retrieving the data from the API
 */
const gracefullyHandleException = (
  error: { status: number },
  prisonNumber: string,
): { problemRetrievingData: boolean } => {
  if (isNotFoundError(error)) {
    logger.info(`No Education found for prisoner [${prisonNumber}] in Education And Work Plan API`)
    return { problemRetrievingData: false }
  }

  logger.error('Error retrieving Education data', error)
  return { problemRetrievingData: true }
}

const isNotFoundError = (error: { status: number }): boolean => error.status === 404

export default retrieveEducation
