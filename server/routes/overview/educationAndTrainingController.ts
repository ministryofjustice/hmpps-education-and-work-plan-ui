import { RequestHandler } from 'express'
import { mostRecentFunctionalSkills } from '../functionalSkillsResolver'
import EducationAndTrainingView from './educationAndTrainingView'

export default class EducationAndTrainingController {
  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const {
      prisonerSummary,
      prisonerFunctionalSkills,
      curiousInPrisonCourses,
      induction,
      education,
      inductionSchedule,
    } = res.locals

    const functionalSkills = mostRecentFunctionalSkills(prisonerFunctionalSkills)

    const view = new EducationAndTrainingView(
      prisonerSummary,
      functionalSkills,
      curiousInPrisonCourses,
      induction,
      education,
      inductionSchedule,
    )
    res.render('pages/overview/index', { ...view.renderArgs })
  }
}
