import { RequestHandler } from 'express'
import { CuriousService } from '../../services'
import FunctionalSkillsView from './functionalSkillsView'
import mostRecentFunctionalSkills from '../functionalSkillsResolver'

export default class FunctionalSkillsController {
  constructor(private readonly curiousService: CuriousService) {}

  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const latestFunctionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const view = new FunctionalSkillsView(prisonerSummary, latestFunctionalSkills, allFunctionalSkills)
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }
}
