import type { RequestHandler } from 'express'
import { startOfToday } from 'date-fns'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsView from './createGoalsView'
import futureGoalTargetDateCalculator from '../futureGoalTargetDateCalculator'
import validateCreateGoalsForm from './createGoalsFormValidator'

export default class CreateGoalsController {
  constructor() {}

  getCreateGoalsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const createGoalsForm = req.session.createGoalsForm || {
      prisonNumber,
      goals: [
        {
          title: '',
          steps: [{ title: '' }],
        },
      ],
    }
    req.session.createGoalsForm = undefined

    const today = startOfToday()
    const futureGoalTargetDates = [
      futureGoalTargetDateCalculator(today, 3),
      futureGoalTargetDateCalculator(today, 6),
      futureGoalTargetDateCalculator(today, 12),
    ]

    const view = new CreateGoalsView(prisonerSummary, createGoalsForm, futureGoalTargetDates, req.flash('errors'))
    return res.render('pages/createGoals/index', { ...view.renderArgs })
  }

  // TODO: RR-748 - Implement submit handler for new create goal journey
  submitCreateGoalsForm: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params

    const createGoalsForm = { ...req.body } as CreateGoalsForm
    if (!createGoalsForm.goals) {
      createGoalsForm.goals = []
    }
    createGoalsForm.goals.forEach((goal, goalIndex) => {
      if (!goal.steps) {
        createGoalsForm.goals[goalIndex].steps = []
      }
    })
    req.session.createGoalsForm = createGoalsForm

    const errors = validateCreateGoalsForm(createGoalsForm)
    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(`/plan/${prisonNumber}/goals/create`)
    }

    return res.redirect(`/plan/${prisonNumber}/view/overview`)
  }
}
