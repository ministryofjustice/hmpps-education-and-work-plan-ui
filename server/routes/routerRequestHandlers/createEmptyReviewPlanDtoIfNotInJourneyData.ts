import { NextFunction, Request, Response } from 'express'
import type { ReviewPlanDto } from 'dto'

/**
 * Request handler function to check whether a Review Plan DTO exists in the journeyData.
 * If one does not exist create a new empty Review Plan DTO.
 */
const createEmptyReviewPlanDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData.reviewPlanDto) {
    req.journeyData.reviewPlanDto = {} as ReviewPlanDto
  }

  next()
}

export default createEmptyReviewPlanDtoIfNotInJourneyData
