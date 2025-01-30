import { RequestHandler } from 'express'
import ViewGoalsView from './viewGoalsView'

export default class ViewGoalsController {
  viewGoals: RequestHandler = async (req, res, next) => {
    const { prisonerSummary, allGoalsForPrisoner, induction, inductionSchedule } = res.locals

    const view = new ViewGoalsView(prisonerSummary, allGoalsForPrisoner, induction, inductionSchedule)
    res.render('pages/overview/partials/goalsTab/goalsTabContents', view.renderArgs)
  }
}
