import { NextFunction, Request, RequestHandler, Response } from 'express'
import ReviewCompleteView from './reviewCompleteView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

export default class ReviewCompleteController {
  getReviewCompleteView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { prisonNumber } = req.params
    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)

    const view = new ReviewCompleteView(prisonerSummary, reviewPlanDto)
    return res.render('pages/reviewPlan/review/reviewComplete/index', { ...view.renderArgs })
  }

  goToLearningAndWorkProgressPlan: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Review completed.')
  }
}
