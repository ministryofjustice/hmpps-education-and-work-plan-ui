import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class ExemptionRemovedController {
  getExemptionRemovedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, actionPlanReviews } = res.locals

    return res.render('pages/reviewPlan/removeExemption/exemptionRemoved/index', {
      prisonerSummary,
      nextReviewDate: actionPlanReviews.latestReviewSchedule.reviewDateTo,
    })
  }

  submitExemptionRemoved: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Exemption removed.')
  }
}
