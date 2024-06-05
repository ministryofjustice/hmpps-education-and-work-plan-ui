import { RequestHandler } from 'express'
import WorkAndInterestsView from './workAndInterestsView'

export default class WorkAndInterestsController {
  getWorkAndInterestsView: RequestHandler = async (req, res, next): Promise<void> => {
    const view = new WorkAndInterestsView(req.session.prisonerSummary, res.locals.induction)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
