import type { Assessment, FunctionalSkills } from 'viewModels'
import { Request, RequestHandler } from 'express'
import FunctionalSkillsView from './functionalSkillsView'
import PrisonService from '../../services/prisonService'
import { functionalSkillsByType } from '../functionalSkillsResolver'

export default class FunctionalSkillsController {
  constructor(private readonly prisonService: PrisonService) {}

  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, showServiceOnboardingBanner } = res.locals

    const functionalSkillsFromCurious = res.locals.prisonerFunctionalSkills
    const allAssessments = this.hasSomeAssessments(functionalSkillsFromCurious)
      ? await this.setPrisonNamesOnAssessments(functionalSkillsFromCurious.assessments, req)
      : []

    const { problemRetrievingData } = functionalSkillsFromCurious
    const englishSkills = functionalSkillsByType(allAssessments, 'ENGLISH')
    const mathsSkills = functionalSkillsByType(allAssessments, 'MATHS')
    const digitalSkills = functionalSkillsByType(allAssessments, 'DIGITAL_LITERACY')

    const view = new FunctionalSkillsView(
      prisonerSummary,
      problemRetrievingData,
      englishSkills,
      mathsSkills,
      digitalSkills,
      showServiceOnboardingBanner,
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }

  private hasSomeAssessments(functionalSkillsFromCurious: FunctionalSkills) {
    return functionalSkillsFromCurious.assessments && functionalSkillsFromCurious.assessments.length > 0
  }

  setPrisonNamesOnAssessments = async (assessments: Array<Assessment>, req: Request): Promise<Array<Assessment>> => {
    return this.prisonService.getAllPrisonNamesById(req.user.username).then(allPrisonNamesById => {
      return assessments.map(assessment => {
        return {
          ...assessment,
          prisonName: allPrisonNamesById.get(assessment.prisonId),
        }
      })
    })
  }
}
