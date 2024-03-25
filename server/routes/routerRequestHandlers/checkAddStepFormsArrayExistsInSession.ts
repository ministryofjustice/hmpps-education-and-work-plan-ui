import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the AddStepForms array exists in the session and whether there is at least 1
 * Add Step Form within it.
 */
const checkAddStepFormsArrayExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.newGoal?.addStepForms) {
    logger.warn(
      `No AddStepForms object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoal.addStepForms.length < 1) {
    logger.warn('AddStepForms object in session is empty. Redirecting to Add Step page.')
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-step/1`)
  } else {
    next()
  }
}
export default checkAddStepFormsArrayExistsInSession
