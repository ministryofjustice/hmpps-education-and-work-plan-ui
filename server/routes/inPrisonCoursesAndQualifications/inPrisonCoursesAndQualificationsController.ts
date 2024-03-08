import { RequestHandler } from 'express'
import { CuriousService } from '../../services'
import PrisonService from '../../services/prisonService'
import InPrisonCoursesAndQualificationsView from './inPrisonCoursesAndQualificationsView'

export default class InPrisonCoursesAndQualificationsController {
  constructor(
    private readonly curiousService: CuriousService,
    private readonly prisonService: PrisonService,
  ) {}

  getInPrisonCoursesAndQualificationsView: RequestHandler = async (req, res, next): Promise<void> => {
    // const { prisonNumber } = req.params
    const { prisonerSummary } = req.session

    const view = new InPrisonCoursesAndQualificationsView(prisonerSummary)
    res.render('pages/inPrisonCoursesAndQualifications/index', { ...view.renderArgs })
  }
}
