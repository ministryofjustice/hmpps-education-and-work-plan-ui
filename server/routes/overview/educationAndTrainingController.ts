import { RequestHandler } from 'express'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import EducationAndTrainingView from './educationAndTrainingView'
import { CuriousService } from '../../services'

export default class EducationAndTrainingController {
  constructor(private readonly curiousService: CuriousService) {}

  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const allFunctionalSkills = await this.curiousService.getPrisonerFunctionalSkills(prisonNumber, req.user.username)
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      res.locals.curiousInPrisonCourses,
      res.locals.induction,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
