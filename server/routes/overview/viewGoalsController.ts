import { RequestHandler } from 'express'
import type { Goal } from 'viewModels'
import ViewGoalsView from './viewGoalsView'
import GoalStatusValue from '../../enums/goalStatusValue'

export default class ViewGoalsController {
  viewGoals: RequestHandler = async (req, res, next) => {
    const { prisonerSummary } = req.session
    const { goals, problemRetrievingData } = res.locals.goals

    const filterGoalsByStatus = (status: GoalStatusValue) => goals.filter((goal: Goal) => goal.status === status)

    const inProgressGoals = filterGoalsByStatus(GoalStatusValue.ACTIVE)
    const archivedGoals = filterGoalsByStatus(GoalStatusValue.ARCHIVED)
    const completedGoals = filterGoalsByStatus(GoalStatusValue.COMPLETED)

    const view = new ViewGoalsView(
      prisonerSummary,
      inProgressGoals,
      archivedGoals,
      completedGoals,
      problemRetrievingData,
    )
    res.render('pages/overview/partials/goalsTab/goalsTabContents', view.renderArgs)
  }
}
