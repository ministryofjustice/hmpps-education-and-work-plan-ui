import { RequestHandler } from 'express'
import OverviewView from './overviewView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const {
      prisonerSummary,
      allGoalsForPrisoner,
      curiousInPrisonCourses,
      inductionSchedule,
      actionPlanReviews,
      prisonerFunctionalSkills,
      induction,
    } = res.locals

    const view = new OverviewView(
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses,
      inductionSchedule,
      actionPlanReviews,
      allGoalsForPrisoner,
      induction,
    )

    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
