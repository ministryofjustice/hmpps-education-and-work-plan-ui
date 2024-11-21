import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check the ReviewDto exists in the prisoner context.
 */
const checkReviewPlanDtoExistsInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  // TODO - replace with DTO check once implemented
  const urlPath = req.originalUrl || ''

  if (urlPath.includes('/review/exemption')) {
    return next()
  }

  if (!getPrisonerContext(req.session, req.params.prisonNumber).reviewPlanDto) {
    logger.warn(
      `No ReviewPlanDto object in prisonerContext - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkReviewPlanDtoExistsInPrisonerContext
