import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import QualificationLevelView from './qualificationLevelView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationLevelController extends InductionController {
  /**
   * Returns the Qualification Level view; suitable for use by the Create and Update journeys.
   */
  getQualificationLevelView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { pageFlowHistory, prisonerSummary } = req.session
    if (!pageFlowHistory) {
      return res.redirect(`/plan/${prisonerSummary.prisonNumber}/view/education-and-training`)
    }
    this.addCurrentPageToHistory(req)

    const qualificationLevelForm = req.session.qualificationLevelForm || { qualificationLevel: '' }
    req.session.qualificationLevelForm = undefined

    const view = new QualificationLevelView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationLevelForm,
    )
    return res.render('pages/induction/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}
