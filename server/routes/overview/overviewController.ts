import { RequestHandler } from 'express'
import OverviewView from './overviewView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const {
      prisonerSummary,
      allGoalsForPrisoner,
      curiousInPrisonCourses,
      actionPlanReviews,
      prisonerFunctionalSkills,
      induction,
    } = res.locals

    const view = new OverviewView(
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses,
      actionPlanReviews,
      allGoalsForPrisoner,
      induction,
    )

    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
