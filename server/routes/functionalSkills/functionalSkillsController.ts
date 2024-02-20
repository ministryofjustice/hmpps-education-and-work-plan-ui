import type { Assessment } from 'viewModels'
import { Request, RequestHandler } from 'express'
import { CuriousService } from '../../services'
import FunctionalSkillsView from './functionalSkillsView'
import PrisonService from '../../services/prisonService'
import { functionalSkillsByType } from '../functionalSkillsResolver'

export default class FunctionalSkillsController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly prisonService: PrisonService,
  ) {}

  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const functionalSkillsFromCurious = await this.curiousService.getPrisonerFunctionalSkills(
      prisonNumber,
      req.user.username,
    )
    const allAssessments = await this.setPrisonNamesOnAssessments(functionalSkillsFromCurious.assessments || [], req)

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
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }

  setPrisonNamesOnAssessments = async (assessments: Array<Assessment>, req: Request): Promise<Array<Assessment>> => {
    const assessmentsWithPrisonLookups = assessments.map(async assessment => {
      const prison = await this.prisonService.lookupPrison(assessment.prisonId, req.user.username)
      return {
        ...assessment,
        prisonName: prison?.prisonName,
      }
    })
    return Promise.all(assessmentsWithPrisonLookups)
  }
}
