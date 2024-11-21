import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check the ReviewDto exists in the prisoner context.
 */
const checkReviewPlanDtoExistsInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  const urlPath = req.originalUrl || ''
  const prisonerContext = getPrisonerContext(req.session, req.params.prisonNumber)

  // Exemption-specific check
  if (urlPath.includes('/review/exemption')) {
    if (!prisonerContext.reviewExemptionDto) {
      logger.warn(
        `No review exemption data in prisonerContext - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
      )
      return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
    }
    return next()
  }

  // ReviewPlan-specific check
  if (!prisonerContext.reviewPlanDto) {
    logger.warn(
      `No ReviewPlanDto object in prisonerContext - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkReviewPlanDtoExistsInPrisonerContext
