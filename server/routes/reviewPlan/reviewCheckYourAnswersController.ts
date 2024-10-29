import { RequestHandler } from 'express'
import ReviewCheckYourAnswersView from './reviewCheckYourAnswersView'

export default class ReviewCheckYourAnswersController {
  getReviewCheckYourAnswersView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals

    const view = new ReviewCheckYourAnswersView(prisonerSummary)
    return res.render('pages/reviewPlan/checkYourAnswers', { ...view.renderArgs })
  }
}
