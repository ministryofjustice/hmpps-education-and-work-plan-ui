import { RequestHandler } from 'express'
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

    const { problemRetrievingData } = functionalSkillsFromCurious
    const englishSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'ENGLISH')
    const mathsSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'MATHS')
    const digitalSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'DIGITAL_LITERACY')

    const assessmentTypes: ('ENGLISH' | 'MATHS' | 'DIGITAL_LITERACY')[] = ['ENGLISH', 'MATHS', 'DIGITAL_LITERACY']

    const allSkillsByType = assessmentTypes.flatMap(type =>
      functionalSkillsByType(functionalSkillsFromCurious.assessments, type),
    )

    await Promise.all(
      allSkillsByType.map(async assessment => {
        const prison = await this.prisonService.lookupPrison(assessment.prisonId, req.user.username)
        if (prison) {
          // eslint-disable-next-line no-param-reassign
          assessment.prisonName = prison.prisonName
        }
      }),
    )

    const view = new FunctionalSkillsView(
      prisonerSummary,
      problemRetrievingData,
      englishSkills,
      mathsSkills,
      digitalSkills,
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }
}
