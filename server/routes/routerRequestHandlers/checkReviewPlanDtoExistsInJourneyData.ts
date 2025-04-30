import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the ReviewDto exists in the journeyData.
 */
const checkReviewPlanDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData.reviewPlanDto) {
    logger.warn(
      `No ReviewPlanDto object in journeyData - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkReviewPlanDtoExistsInJourneyData
