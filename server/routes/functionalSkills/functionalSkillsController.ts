import { RequestHandler } from 'express'
import mostRecentFunctionalSkills from '../functionalSkillsResolver'
import { CuriousService } from '../../services'
import AllFunctionalSkillsView from './allFunctionalSkillsView'

export default class FunctionalSkillsController {
  constructor(private readonly curiousService: CuriousService) {}

  getAllFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const latestFunctionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const view = new AllFunctionalSkillsView(prisonerSummary, latestFunctionalSkills, allFunctionalSkills)
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }
}
