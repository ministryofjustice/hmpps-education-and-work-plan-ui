import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Request handler function to check the PrisonerSummary exists in the session for the prisoner referenced in the
 * request URL.
 */
const checkPrisonerSummaryExistsInSession = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.prisonerSummary) {
    logger.warn(
      `No PrisonerSummary object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to prisoner Overview page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else if (req.session.prisonerSummary.prisonNumber !== req.params.prisonNumber) {
    logger.warn(
      'PrisonerSummary object in session references a different prisoner. Redirecting to prisoner Overview page.',
    )
    req.session.prisonerSummary = undefined
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else {
    next()
  }
})
export default checkPrisonerSummaryExistsInSession
