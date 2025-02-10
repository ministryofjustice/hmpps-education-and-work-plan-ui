import type { Assessment, FunctionalSkills } from 'viewModels'
import { RequestHandler } from 'express'
import FunctionalSkillsView from './functionalSkillsView'
import PrisonService from '../../services/prisonService'
import { functionalSkillsByType } from '../functionalSkillsResolver'
import logger from '../../../logger'

export default class FunctionalSkillsController {
  constructor(private readonly prisonService: PrisonService) {}

  getFunctionalSkillsView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const functionalSkillsFromCurious = res.locals.prisonerFunctionalSkills
    const allAssessments = this.hasSomeAssessments(functionalSkillsFromCurious)
      ? await this.setPrisonNamesOnAssessments(functionalSkillsFromCurious.assessments, req.user.username)
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
    )
    res.render('pages/functionalSkills/index', { ...view.renderArgs })
  }

  private hasSomeAssessments(functionalSkillsFromCurious: FunctionalSkills) {
    return functionalSkillsFromCurious.assessments && functionalSkillsFromCurious.assessments.length > 0
  }

  private setPrisonNamesOnAssessments = async (
    assessments: Array<Assessment>,
    username: string,
  ): Promise<Array<Assessment>> => {
    const allPrisonNamesById = await this.getAllPrisonNamesByIdSafely(username)
    return assessments.map(assessment => {
      return {
        ...assessment,
        prisonName: allPrisonNamesById.get(assessment.prisonId),
      }
    })
  }

  private getAllPrisonNamesByIdSafely = async (username: string): Promise<Map<string, string>> => {
    try {
      return await this.prisonService.getAllPrisonNamesById(username)
    } catch (error) {
      logger.error(`Error retrieving prison names, defaulting to just IDs: ${error}`)
      return new Map()
    }
  }
}
