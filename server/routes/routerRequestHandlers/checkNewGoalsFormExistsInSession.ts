import { NextFunction, Request, Response } from 'express'
import logger from '../../../logger'
import asyncMiddleware from '../../middleware/asyncMiddleware'

/**
 * Request handler function to check the NewGoal array exists in the session and contains at least 1 element, where each
 * element contains an AddNoteForm (if a given element does not contain an AddNoteForm it means the pages are being navigated
 * out of sequence)
 */
const checkNewGoalsFormExistsInSession = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.newGoals) {
    logger.warn(
      `No NewGoal objects in session - user attempting to navigate to path ${req.path} out of sequence. Redirecting to start of Create Goal journey.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/create`)
  } else if (req.session.newGoals.length < 1) {
    logger.warn('NewGoal array in session is empty. Redirecting to Add Note page.')
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-note`)
  } else if (req.session.newGoals.some(newGoal => newGoal.addNoteForm === undefined || newGoal.addNoteForm === null)) {
    logger.warn(
      `At least 1 NewGoal has no AddNoteForm object - user attempting to navigate to path ${req.path} out of sequence. Redirecting to Add Note page.`,
    )
    res.redirect(`/plan/${req.params.prisonNumber}/goals/1/add-note`)
  } else {
    next()
  }
})
export default checkNewGoalsFormExistsInSession
