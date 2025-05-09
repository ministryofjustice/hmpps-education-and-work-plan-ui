import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the Induction DTO exists in the journeyData.
 */
const checkInductionDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData.inductionDto) {
    logger.warn(
      `No InductionDto in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkInductionDtoExistsInJourneyData
