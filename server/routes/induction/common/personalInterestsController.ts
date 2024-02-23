import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import PersonalInterestsView from './personalInterestsView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class PersonalInterestsController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the Personal Interests view; suitable for use by the Create and Update journeys.
   */
  getPersonalInterestsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary } = req.session

    const view = new PersonalInterestsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      req.flash('errors'),
    )
    return res.render('pages/induction/personalInterests/index', { ...view.renderArgs })
  }
}
