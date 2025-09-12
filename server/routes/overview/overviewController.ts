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
      prisonNamesById,
    } = res.locals

    const view = new OverviewView(inductionSchedule, actionPlanReviews, allGoalsForPrisoner, induction, prisonNamesById)

    res.render('pages/overview/index', {
      ...view.renderArgs,
      tab: 'overview',
      prisonerSummary,
      curiousInPrisonCourses,
      prisonerFunctionalSkills,
      prisonNamesById,
    })
  }
}
