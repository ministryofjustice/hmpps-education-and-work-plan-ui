import { NextFunction, Request, RequestHandler, Response } from 'express'
import InductionController from './inductionController'
import CheckYourAnswersView from './checkYourAnswersView'

/**
 * Abstract controller class defining functionality common to both the Create and Update Induction journeys.
 */
export default abstract class CheckYourAnswersController extends InductionController {
  /**
   * Returns the Check Your Answers view; suitable for use by the Create and Update journeys.
   */
  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Reset all the "need to complete journey" flags now that we are on Check Your Answers
    req.journeyData.inductionDto.previousWorkExperiences.needToCompleteJourneyFromCheckYourAnswers = false
    req.journeyData.inductionDto.previousQualifications.needToCompleteJourneyFromCheckYourAnswers = false
    req.journeyData.inductionDto.futureWorkInterests.needToCompleteJourneyFromCheckYourAnswers = false

    const { inductionDto } = req.journeyData
    const { prisonerSummary } = res.locals

    const view = new CheckYourAnswersView(prisonerSummary, inductionDto)
    return res.render('pages/induction/checkYourAnswers/index', { ...view.renderArgs })
  }
}
