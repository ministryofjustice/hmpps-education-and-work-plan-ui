import type { RequestHandler } from 'express'
import type { NewGoal } from 'compositeForms'
import moment from 'moment'
import CreateGoalsView from './createGoalsView'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'

export default class CreateGoalsController {
  constructor() {}

  // TODO: RR-734 - Create controller and view classes new create goal journey
  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    req.session.newGoals = req.session.newGoals || []

    if (!req.session.newGoal?.createGoalForm) {
      req.session.newGoal = {
        createGoalForm: { prisonNumber },
      } as NewGoal
    }

    const today = moment().toDate()
    const futureGoalTargetDates = [
      futureGoalTargetDateCalculator(today, 3),
      futureGoalTargetDateCalculator(today, 6),
      futureGoalTargetDateCalculator(today, 12),
    ]

    const view = new CreateGoalsView(
      prisonerSummary,
      req.session.newGoal.createGoalForm,
      futureGoalTargetDates,
      req.flash('errors'),
    )
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  // TODO: RR-748 - Implement submit handler for new create goal journey
  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
