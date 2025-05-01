import { NextFunction, Request, RequestHandler, Response } from 'express'
import ExemptionRecordedView from './exemptionRecordedView'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'

export default class ExemptionRecordedController {
  getExemptionRecordedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, actionPlanReviews } = res.locals

    const { reviewExemptionDto } = req.journeyData
    const exemptionDueToTechnicalIssue =
      reviewExemptionDto.exemptionReason === ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE

    const view = new ExemptionRecordedView(prisonerSummary, actionPlanReviews, exemptionDueToTechnicalIssue)
    return res.render('pages/reviewPlan/exemption/exemptionRecorded/index', { ...view.renderArgs })
  }

  submitExemptionRecorded: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    const { reviewExemptionDto } = req.journeyData

    const exemptionDueToTechnicalIssue =
      reviewExemptionDto.exemptionReason === ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE
    const successMessage = exemptionDueToTechnicalIssue
      ? 'Exemption recorded.'
      : 'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>'

    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, successMessage)
  }
}
