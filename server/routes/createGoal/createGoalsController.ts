import type { RequestHandler } from 'express'
import moment from 'moment'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsView from './createGoalsView'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'

export default class CreateGoalsController {
  constructor() {}

  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    req.session.newGoalsForm = req.session.newGoalsForm || []

    if (!req.session.newGoalsForm?.createGoalsForm) {
      req.session.newGoalsForm = {
        prisonNumber,
        goals: [
          {
            steps: [{ title: '' }],
          },
        ],
      } as CreateGoalsForm
    }

    const today = moment().toDate()
    const futureGoalTargetDates = [
      futureGoalTargetDateCalculator(today, 3),
      futureGoalTargetDateCalculator(today, 6),
      futureGoalTargetDateCalculator(today, 12),
    ]

    const view = new CreateGoalsView(
      prisonerSummary,
      req.session.newGoalsForm,
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
