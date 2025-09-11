import { RequestHandler } from 'express'
import { toInductionScheduleView } from './overviewViewFunctions'

export default class EducationAndTrainingController {
  getEducationAndTrainingView: RequestHandler = async (req, res, next): Promise<void> => {
    const {
      prisonerSummary,
      prisonerFunctionalSkills,
      prisonNamesById,
      curiousInPrisonCourses,
      induction,
      education,
      inductionSchedule,
    } = res.locals

    res.render('pages/overview/index', {
      tab: 'education-and-training',
      prisonerSummary,
      prisonerFunctionalSkills,
      prisonNamesById,
      inPrisonCourses: curiousInPrisonCourses,
      induction,
      education,
      inductionSchedule: toInductionScheduleView(inductionSchedule, induction.inductionDto),
    })
  }
}
