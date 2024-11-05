import { NextFunction, Request, RequestHandler, Response } from 'express'
import ReviewCompleteView from './reviewCompleteView'

export default class ReviewCompleteController {
  getReviewCompleteView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary } = res.locals

    const view = new ReviewCompleteView(prisonerSummary)
    return res.render('pages/reviewPlan/reviewComplete/index', { ...view.renderArgs })
  }

  goToLearningAndWorkProgressPlan: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirect(`/plan/${prisonNumber}/overview`)
  }
}
