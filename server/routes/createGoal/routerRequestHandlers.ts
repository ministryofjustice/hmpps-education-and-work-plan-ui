import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * A module exporting request handler functions to support ensuring the Create A Goal process has been followed
 * in the correct sequence - IE. pages are not being called out of sequence.
 */

/**
 * Request handler function to check the CreateGoalForm exists in the session for the prisoner reference in the
 * request URL.
 */
const checkCreateGoalFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.createGoalForm) {
    logger.warn(
      `No CreateGoalForm object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/create`)
  } else if (req.session.createGoalForm.prisonNumber !== req.params.prisonNumber) {
    logger.warn(
      `CreateGoalForm object in session references a different prisoner. Redirecting to start of Create Goal journey.`,
    )
    req.session.createGoalForm = undefined
    res.redirect(`/plan/${req.params.prisonNumber}/goals/create`)
  } else {
    next()
  }
}

const checkAddStepFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  next()
}

export { checkCreateGoalFormExistsInSession, checkAddStepFormExistsInSession }
