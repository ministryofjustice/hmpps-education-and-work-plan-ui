import { NextFunction, Request, RequestHandler, Response } from 'express'
import ExemptionRemovedView from './exemptionRemovedView'

export default class ExemptionRemovedController {
  getExemptionRemovedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, actionPlanReviews } = res.locals

    const view = new ExemptionRemovedView(prisonerSummary, actionPlanReviews)
    return res.render('pages/reviewPlan/removeExemption/exemptionRemoved/index', { ...view.renderArgs })
  }

  submitExemptionRemoved: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, 'Exemption removed.')
  }
}
