import { RequestHandler } from 'express'
import WorkAndInterestsView from './workAndInterestsView'

export default class WorkAndInterestsController {
  getWorkAndInterestsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, induction, inductionSchedule, prisonNamesById } = res.locals
    const view = new WorkAndInterestsView(prisonerSummary, induction, inductionSchedule)
    res.render('pages/overview/index', { ...view.renderArgs, prisonNamesById })
  }
}
