import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import QualificationDetailsView from './qualificationDetailsView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class QualificationDetailsController extends InductionController {
  /**
   * Returns the Qualification Details view; suitable for use by the Create and Update journeys.
   */
  getQualificationDetailsView: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { prisonerSummary, qualificationLevelForm } = req.session

    const qualificationDetailsForm = req.session.qualificationDetailsForm || {
      qualificationSubject: '',
      qualificationGrade: '',
    }
    req.session.qualificationDetailsForm = undefined

    const view = new QualificationDetailsView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      qualificationDetailsForm,
      qualificationLevelForm.qualificationLevel,
      req.flash('errors'),
    )
    return res.render('pages/induction/prePrisonEducation/qualificationDetails', { ...view.renderArgs })
  }
}
