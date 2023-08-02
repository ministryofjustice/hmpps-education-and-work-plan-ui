import type { RequestHandler } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import UpdateGoalView from './updateGoalView'

export default class UpdateGoalController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getUpdateGoalView: RequestHandler = async (req, res, next): Promise<void> => {
    // const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    if (!req.session.updateGoalForm) {
      // req.session.updateGoalForm = { prisonNumber }
    }

    const view = new UpdateGoalView(prisonerSummary, req.session.updateGoalForm, req.flash('errors'))
    res.render('pages/goal/edit/index', { ...view.renderArgs })
  }
}
