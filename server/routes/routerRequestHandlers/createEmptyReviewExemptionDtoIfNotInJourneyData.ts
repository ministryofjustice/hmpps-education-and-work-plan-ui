import { NextFunction, Request, Response } from 'express'
import type { ReviewExemptionDto } from 'dto'

/**
 * Request handler function to check whether a Review Exemption DTO exists in the journeyData.
 * If one does not exist create a new empty Review Exemption DTO for the prisoner.
 */
const createEmptyReviewExemptionDtoIfNotInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  const { prisonNumber } = req.params

  if (!req.journeyData.reviewExemptionDto) {
    req.journeyData.reviewExemptionDto = { prisonNumber } as ReviewExemptionDto
  }

  next()
}

export default createEmptyReviewExemptionDtoIfNotInJourneyData
