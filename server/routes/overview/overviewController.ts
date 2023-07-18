import { RequestHandler } from 'express'
import OverviewView from './overviewView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.createGoalForm = undefined

    const { prisonerSummary } = req.session
    const { supportNeeds } = req.session

    const view = new OverviewView(prisonerSummary, 'overview', prisonNumber, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { supportNeeds } = req.session

    const view = new OverviewView(prisonerSummary, 'support-needs', prisonNumber, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
