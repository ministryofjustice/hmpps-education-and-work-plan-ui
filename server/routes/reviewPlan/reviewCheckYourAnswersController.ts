import { RequestHandler } from 'express'
import ReviewCheckYourAnswersView from './reviewCheckYourAnswersView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import { addCurrentPageToHistory } from '../pageFlowHistory'

export default class ReviewCheckYourAnswersController {
  getReviewCheckYourAnswersView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const userName = res.locals.user.name
    addCurrentPageToHistory(req)

    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)

    const view = new ReviewCheckYourAnswersView(prisonerSummary, reviewPlanDto, userName)
    return res.render('pages/reviewPlan/checkYourAnswers', { ...view.renderArgs })
  }
}
