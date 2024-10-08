import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

/**
 * Request handler function to check the UpdateGoalForm exists in the session for the prisoner referenced in the
 * request URL.
 */
const checkUpdateGoalFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!getPrisonerContext(req.session, req.params.prisonNumber).updateGoalForm) {
    logger.warn(
      `No UpdateGoalForm object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Overview page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/view/overview`)
  } else {
    next()
  }
}
export default checkUpdateGoalFormExistsInSession
