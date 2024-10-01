import { RequestHandler } from 'express'
import InPrisonCoursesAndQualificationsView from './inPrisonCoursesAndQualificationsView'

export default class InPrisonCoursesAndQualificationsController {
  getInPrisonCoursesAndQualificationsViewForPlp: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary, curiousInPrisonCourses } = res.locals
    const view = new InPrisonCoursesAndQualificationsView(prisonerSummary, curiousInPrisonCourses)
    res.render('pages/inPrisonCoursesAndQualifications/plpTemplate', { ...view.renderArgs })
  }

  getInPrisonCoursesAndQualificationsViewForDps: RequestHandler = async (req, res): Promise<void> => {
    const { prisonerSummary, curiousInPrisonCourses } = res.locals
    const view = new InPrisonCoursesAndQualificationsView(prisonerSummary, curiousInPrisonCourses)
    res.render('pages/inPrisonCoursesAndQualifications/dpsTemplate', { ...view.renderArgs })
  }
}
