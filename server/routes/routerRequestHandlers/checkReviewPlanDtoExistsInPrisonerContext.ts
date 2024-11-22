import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import checkReviewExemptionDtoExistsInPrisonerContext from './checkReviewExemptionDtoExistsInPrisonerContext'

/**
 * Request handler function to check the ReviewDto exists in the prisoner context.
 */
const checkReviewPlanDtoExistsInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  const urlPath = req.originalUrl || ''
  const prisonerContext = getPrisonerContext(req.session, req.params.prisonNumber)

  // Exemption-specific check
  if (urlPath.includes('/review/exemption')) {
    return checkReviewExemptionDtoExistsInPrisonerContext(req, res, next)
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
