import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'

/**
 * Request handler function to check the CreateGoalForm exists in the session for the prisoner referenced in the
 * request URL.
 * In the case of an 'edit mode' request, the handler function gets the relevant new goal from the array of new goals held
 * in session first.
 */
const checkCreateGoalFormExistsInSession = async (req: Request, res: Response, next: NextFunction) => {
  if (isEditMode(req)) {
    // If the request is an edit mode request we need to get the relevant newGoal object from the newGoals array
    const { goalIndex } = req.params
    req.session.newGoal = req.session.newGoals[parseInt(goalIndex, 10) - 1]
  }

  if (!req.session.newGoal?.createGoalForm) {
    logger.warn(
      `No CreateGoalForm object in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoal.createGoalForm.prisonNumber !== req.params.prisonNumber) {
    logger.warn(
      'CreateGoalForm object in session references a different prisoner. Redirecting to start of Create Goal journey.',
    )
    req.session.newGoal.createGoalForm = undefined
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else {
    next()
  }
}
const isEditMode = (req: Request): boolean => req.query?.mode === 'edit'

export default checkCreateGoalFormExistsInSession
