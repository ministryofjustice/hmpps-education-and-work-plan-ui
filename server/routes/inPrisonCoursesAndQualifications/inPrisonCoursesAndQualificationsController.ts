import { RequestHandler } from 'express'
import InPrisonCoursesAndQualificationsView from './inPrisonCoursesAndQualificationsView'

export default class InPrisonCoursesAndQualificationsController {
  getInPrisonCoursesAndQualificationsView: RequestHandler = async (req, res, next): Promise<void> => {
    const view = new InPrisonCoursesAndQualificationsView(
      req.session.prisonerSummary,
      res.locals.curiousInPrisonCourses,
    )
    res.render('pages/inPrisonCoursesAndQualifications/index', { ...view.renderArgs })
  }
}
