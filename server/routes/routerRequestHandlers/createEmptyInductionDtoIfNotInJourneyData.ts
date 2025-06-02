import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import { EducationAndWorkPlanService } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Middleware function that returns a request handler function to check whether an InductionDto exists in the journeyData for
 * the prisoner referenced in the request URL.
 * If one does not exist, or it is for a different prisoner, create a new empty InductionDto for the prisoner.
 * If the prisoner already has qualifications, add them to the InductionDto.
 */
const createEmptyInductionDtoIfNotInJourneyData = (
  educationAndWorkPlanService: EducationAndWorkPlanService,
): RequestHandler => {
  return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params

    // Either no Induction in the journeyData, or it's for a different prisoner. Create a new one, including the prisoners education if it has been previously recorded.
    if (req.journeyData?.inductionDto?.prisonNumber !== prisonNumber) {
      let educationDto: EducationDto
      try {
        educationDto = await educationAndWorkPlanService.getEducation(prisonNumber, req.user.username)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        educationDto = undefined
      }

      req.journeyData = {
        inductionDto: {
          prisonNumber,
          previousQualifications: educationDto
            ? {
                educationLevel: educationDto.educationLevel,
                qualifications: educationDto.qualifications,
              }
            : undefined,
        } as InductionDto,
      }
    }

    next()
  })
}

export default createEmptyInductionDtoIfNotInJourneyData
