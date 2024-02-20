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

    // Get all functional skills with the type 'ENGLISH' and add the prison name to the object for each from the prison service
    const englishSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'ENGLISH')
    await Promise.all(
      englishSkills.map(async assessment => {
        const prison = await this.prisonService.lookupPrison(assessment.prisonId, req.user.username)
        if (prison) {
          // TODO refactor to avoid param-reassign eslint rule
          // eslint-disable-next-line no-param-reassign
          assessment.prisonName = prison.prisonName
        }
      }),
    )

    // Get all functional skills with the type 'MATHS' and add the prison name to the object for each from the prison service
    const mathsSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'MATHS')
    await Promise.all(
      mathsSkills.map(async assessment => {
        const prison = await this.prisonService.lookupPrison(assessment.prisonId, req.user.username)
        if (prison) {
          // TODO refactor to avoid param-reassign eslint rule
          // eslint-disable-next-line no-param-reassign
          assessment.prisonName = prison.prisonName
        }
      }),
    )

    // Get all functional skills with the type 'DIGITAL_LITERACY' and add the prison name to the object for each from the prison service
    const digitalSkills = functionalSkillsByType(functionalSkillsFromCurious.assessments, 'DIGITAL_LITERACY')
    await Promise.all(
      digitalSkills.map(async assessment => {
        const prison = await this.prisonService.lookupPrison(assessment.prisonId, req.user.username)
        if (prison) {
          // TODO refactor to avoid param-reassign eslint rule
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
