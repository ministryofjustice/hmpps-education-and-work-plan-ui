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
    const { prisonerSummary, invalidForm } = res.locals

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const qualificationLevelForm = invalidForm ?? { qualificationLevel: '' }

    const view = new QualificationLevelView(prisonerSummary, qualificationLevelForm)
    return res.render('pages/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}
