import { RequestHandler } from 'express'
import ViewGoalsView from './viewGoalsView'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'

export default class ViewGoalsController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  viewGoals: RequestHandler = async (req, res, next) => {
    try {
      const { prisonerSummary } = req.session
      const { prisonNumber } = req.params
      const { username } = req.user

      const prisonerGoals = await this.educationAndWorkPlanService.getAllGoalsForPrisoner(prisonNumber, username)

      const view = new ViewGoalsView(
        prisonerSummary,
        prisonerGoals.goals.ACTIVE,
        prisonerGoals.goals.ARCHIVED,
        prisonerGoals.goals.COMPLETE,
        prisonerGoals.problemRetrievingData,
      )

      res.render('pages/overview/partials/goalsTab/goalsTabContents', view.renderArgs)
    } catch (error) {
      next(error)
    }
  }
}
