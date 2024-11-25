import { RequestHandler } from 'express'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import EducationAndTrainingView from './educationAndTrainingView'

export default class EducationAndTrainingController {
  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const allFunctionalSkills = res.locals.prisonerFunctionalSkills
    const functionalSkills = mostRecentFunctionalSkills(allFunctionalSkills)

    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      res.locals.curiousInPrisonCourses,
      res.locals.induction,
      res.locals.education,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
