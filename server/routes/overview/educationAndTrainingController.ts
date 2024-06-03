import { RequestHandler } from 'express'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import EducationAndTrainingView from './educationAndTrainingView'
import { CuriousService, InductionService } from '../../services'

export default class EducationAndTrainingController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly inductionService: InductionService,
  ) {}

  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const educationAndTraining = await this.inductionService.getEducationAndTraining(prisonNumber, req.user.token)

    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      res.locals.curiousInPrisonCourses,
      educationAndTraining,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
