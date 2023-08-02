import type { RequestHandler } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalView from './updateGoalView'
import { toUpdateGoalForm } from './mappers/goalToUpdateGoalFormMapper'

export default class UpdateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, goalReference } = req.params
    const { prisonerSummary } = req.session

    const actionPlan = await this.educationAndWorkPlanService.getActionPlan(prisonNumber, req.user.token)
    const goalToUpdate = actionPlan.goals.find(goal => goal.goalReference === goalReference)
    const updateGoalForm = toUpdateGoalForm(goalToUpdate)

    const view = new UpdateGoalView(prisonerSummary, updateGoalForm, req.flash('errors'))
    res.render('pages/goal/edit/index', { ...view.renderArgs })
  }
}
