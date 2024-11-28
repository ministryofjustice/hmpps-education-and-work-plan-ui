import { RequestHandler } from 'express'
import { EducationAndWorkPlanService } from '../../services'
import OverviewView from './overviewView'

export default class OverviewController {
  constructor(private readonly educationAndWorkPlanService: EducationAndWorkPlanService) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, curiousInPrisonCourses, prisonerFunctionalSkills, induction, actionPlanReviews } =
      res.locals

    const prisonerGoals = await this.educationAndWorkPlanService.getAllGoalsForPrisoner(prisonNumber, req.user.username)

    const view = new OverviewView(
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses,
      actionPlanReviews,
      prisonerGoals,
      induction,
    )

    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
