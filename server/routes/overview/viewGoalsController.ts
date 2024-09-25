import { RequestHandler } from 'express'
import ViewGoalsView from './viewGoalsView'

export default class ViewGoalsController {
  constructor() {}

  viewGoals: RequestHandler = async (req, res, next): Promise<void> => {
    const view = new ViewGoalsView(req.session.prisonerSummary)
    res.render('pages/overview/partials/goalsTab/goalsTabContents', { ...view.renderArgs })
  }
}
