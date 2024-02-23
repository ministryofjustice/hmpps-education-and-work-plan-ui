import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import SkillsView from './skillsView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class SkillsController extends InductionController {
  constructor() {
    super()
  }

  /**
   * Returns the Skills view; suitable for use by the Create and Update journeys.
   */
  getSkillsView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary } = req.session

    const view = new SkillsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      req.flash('errors'),
    )
    return res.render('pages/induction/skills/index', { ...view.renderArgs })
  }
}
