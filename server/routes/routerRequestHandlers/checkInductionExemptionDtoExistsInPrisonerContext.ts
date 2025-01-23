import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
/**
 * Request handler function to check the Induction Exemption DTO exists in the prisoner context.
 */
const checkInductionExemptionDtoExistsInPrisonerContext = async (req: Request, res: Response, next: NextFunction) => {
  if (!getPrisonerContext(req.session, req.params.prisonNumber).inductionExemptionDto) {
    logger.warn(
      `No Induction exemption data in prisonerContext - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    return res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  }
  return next()
}
export default checkInductionExemptionDtoExistsInPrisonerContext
