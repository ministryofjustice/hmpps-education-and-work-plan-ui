import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import CheckYourAnswersView from './additionalTrainingView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class CheckYourAnswersController extends InductionController {
  /**
   * Returns the Check Your Answers view; suitable for use by the Create and Update journeys.
   */
  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionDto } = req.session

    const view = new CheckYourAnswersView(
      prisonerSummary,
      this.getBackLinkUrl(req),
      this.getBackLinkAriaText(req),
      inductionDto,
    )
    return res.render('pages/induction/checkYourAnswers/index', { ...view.renderArgs })
  }
}
