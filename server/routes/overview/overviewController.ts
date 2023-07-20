import { RequestHandler } from 'express'
import EducationAndTrainingView from './educationAndTrainingView'
import OverviewView from './overviewView'
import SupportNeedsView from './supportNeedsView'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.createGoalForm = undefined

    const { prisonerSummary } = req.session

    const view = new OverviewView(prisonerSummary, 'overview', prisonNumber)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session
    const { supportNeeds } = req.session

    const view = new SupportNeedsView(prisonerSummary, 'support-needs', prisonNumber, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getEducationAndTrainingNeeds: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const view = new EducationAndTrainingView(prisonerSummary, 'support-needs', prisonNumber)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
