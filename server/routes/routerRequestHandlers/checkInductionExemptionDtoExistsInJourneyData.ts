import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the Induction Exemption DTO exists in the request journeyData
 */
const checkInductionExemptionDtoExistsInJourneyData = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.journeyData?.inductionExemptionDto) {
    logger.warn(
      `No Induction Exemption data in journeyData - user attempting to navigate to path ${req.originalUrl} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkInductionExemptionDtoExistsInJourneyData
