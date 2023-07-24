import { RequestHandler } from 'express'
import EducationAndTrainingView from './educationAndTrainingView'
import OverviewView from './overviewView'
import SupportNeedsView from './supportNeedsView'
import { CuriousService } from '../../services'

export default class OverviewController {
  constructor(private readonly curiousService: CuriousService) {}

  getOverviewView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    req.session.createGoalForm = undefined

    const { prisonerSummary } = req.session

    const view = new OverviewView(prisonerSummary, prisonNumber)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getSupportNeedsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const supportNeeds = await this.curiousService.getPrisonerSupportNeeds(prisonNumber, req.user.username)
    const view = new SupportNeedsView(prisonerSummary, supportNeeds)
    res.render('pages/overview/index', { ...view.renderArgs })
  }

  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const functionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const view = new EducationAndTrainingView(prisonerSummary, functionalSkills)
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
