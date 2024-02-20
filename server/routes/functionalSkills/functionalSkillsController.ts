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

    const problemRetrievingData = !!functionalSkillsFromCurious.problemRetrievingData
    const englishSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'ENGLISH')
    const mathsSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'MATHS')
    const digitalSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'DIGITAL_LITERACY')

    const view = new FunctionalSkillsView(
      prisonerSummary,
      latestFunctionalSkillsFromCurious,
      allFunctionalSkillsFromCurious,
      problemRetrievingData,
      englishSkills,
      mathsSkills,
      digitalSkills,
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }
}
