import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the Review Exemption DTO exists in the journeyData.
 */
const checkReviewExemptionDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData.reviewExemptionDto) {
    logger.warn(
      `No review exemption data in journeyData - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkReviewExemptionDtoExistsInJourneyData
