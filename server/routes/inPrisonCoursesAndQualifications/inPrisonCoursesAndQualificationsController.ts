import { RequestHandler } from 'express'

export default class InPrisonCoursesAndQualificationsController {
  getInPrisonCoursesAndQualificationsViewForPlp: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary, curiousInPrisonCourses, prisonNamesById } = res.locals

    res.render('pages/inPrisonCoursesAndQualifications/plpTemplate', {
      prisonerSummary,
      prisonNamesById,
      curiousInPrisonCourses,
    })
  }

  getInPrisonCoursesAndQualificationsViewForDps: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary, curiousInPrisonCourses, prisonNamesById } = res.locals

    res.render('pages/inPrisonCoursesAndQualifications/dpsTemplate', {
      prisonerSummary,
      prisonNamesById,
      curiousInPrisonCourses,
    })
  }
}
