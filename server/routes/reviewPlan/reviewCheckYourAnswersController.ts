import { RequestHandler } from 'express'
import ReviewCheckYourAnswersView from './reviewCheckYourAnswersView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'

export default class ReviewCheckYourAnswersController {
  getReviewCheckYourAnswersView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals

    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)

    const view = new ReviewCheckYourAnswersView(prisonerSummary, reviewPlanDto)
    return res.render('pages/reviewPlan/checkYourAnswers/index', { ...view.renderArgs })
  }
}
