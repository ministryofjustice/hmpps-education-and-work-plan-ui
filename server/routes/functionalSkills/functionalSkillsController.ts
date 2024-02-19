import { RequestHandler } from 'express'
import { CuriousService } from '../../services'
import FunctionalSkillsView from './functionalSkillsView'
import { allFunctionalSkills, mostRecentFunctionalSkills, functionalSkillsByType } from '../functionalSkillsResolver'

export default class FunctionalSkillsController {
  constructor(private readonly curiousService: CuriousService) {}

  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const functionalSkillsFromCurious = await this.curiousService.getPrisonerFunctionalSkills(
      prisonNumber,
      req.user.username,
    )
    const latestFunctionalSkillsFromCurious = mostRecentFunctionalSkills(functionalSkillsFromCurious)
    const allFunctionalSkillsFromCurious = allFunctionalSkills(functionalSkillsFromCurious)

    const englishSkills = functionalSkillsByType(allFunctionalSkillsFromCurious.assessments, 'ENGLISH')
    const mathsSkills = functionalSkillsByType(allFunctionalSkillsFromCurious.assessments, 'MATHS')
    const digitalSkills = functionalSkillsByType(allFunctionalSkillsFromCurious.assessments, 'DIGITAL_LITERACY')

    const view = new FunctionalSkillsView(
      prisonerSummary,
      latestFunctionalSkillsFromCurious,
      allFunctionalSkillsFromCurious,
      englishSkills,
      mathsSkills,
      digitalSkills,
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }
}
