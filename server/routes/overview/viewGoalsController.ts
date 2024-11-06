import { RequestHandler } from 'express'
import ViewGoalsView from './viewGoalsView'

export default class ViewGoalsController {
  viewGoals: RequestHandler = async (req, res, next) => {
    const { prisonerSummary, showServiceOnboardingBanner } = res.locals

    const view = new ViewGoalsView(prisonerSummary, res.locals.allGoalsForPrisoner, showServiceOnboardingBanner)
    res.render('pages/overview/partials/goalsTab/goalsTabContents', view.renderArgs)
  }
}
