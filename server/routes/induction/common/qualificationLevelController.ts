import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { QualificationLevelForm } from 'forms'
import InductionController from './inductionController'
import QualificationLevelView from './qualificationLevelView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

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
    const { prisonerSummary } = res.locals
    const { prisonNumber } = req.params

    this.addCurrentPageToFlowHistoryWhenComingFromCheckYourAnswers(req)

    const qualificationLevelForm: QualificationLevelForm = getPrisonerContext(req.session, prisonNumber)
      .qualificationLevelForm || { qualificationLevel: '' }
    getPrisonerContext(req.session, prisonNumber).qualificationLevelForm = undefined

    const view = new QualificationLevelView(prisonerSummary, qualificationLevelForm)
    return res.render('pages/prePrisonEducation/qualificationLevel', { ...view.renderArgs })
  }
}
