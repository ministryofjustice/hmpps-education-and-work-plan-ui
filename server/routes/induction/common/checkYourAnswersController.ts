import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import CheckYourAnswersView from './checkYourAnswersView'
import { buildNewPageFlowHistory } from '../../pageFlowHistory'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class CheckYourAnswersController extends InductionController {
  /**
   * Returns the Check Your Answers view; suitable for use by the Create and Update journeys.
   */
  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    req.session.pageFlowHistory = buildNewPageFlowHistory(req)

    const view = new CheckYourAnswersView(prisonerSummary, inductionDto)
    return res.render('pages/induction/checkYourAnswers/index', { ...view.renderArgs })
  }
}
