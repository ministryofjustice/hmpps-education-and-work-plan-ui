import { RequestHandler } from 'express'
import ViewArchivedGoalsView from './viewArchivedGoalsView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import GoalStatusValue from '../../enums/goalStatusValue'

export default class ViewArchivedGoalsController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  viewArchivedGoals: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const goalsOrProblem = await this.educationAndWorkPlanService.getGoalsByStatus(
      prisonNumber,
      GoalStatusValue.ARCHIVED,
      req.user.token,
    )
    const view = new ViewArchivedGoalsView(req.session.prisonerSummary, goalsOrProblem)
    res.render('pages/overview/viewArchivedGoals', { ...view.renderArgs })
  }
}
