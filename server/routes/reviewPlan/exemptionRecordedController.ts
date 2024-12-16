import { NextFunction, Request, RequestHandler, Response } from 'express'
import ExemptionRecordedView from './exemptionRecordedView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'

export default class ExemptionRecordedController {
  getExemptionRecordedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary, actionPlanReviews } = res.locals

    const { reviewExemptionDto } = getPrisonerContext(req.session, prisonNumber)
    const exemptionDueToTechnicalIssue =
      reviewExemptionDto.exemptionReason === ReviewScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE

    const view = new ExemptionRecordedView(prisonerSummary, actionPlanReviews, exemptionDueToTechnicalIssue)
    return res.render('pages/reviewPlan/exemptionRecorded/index', { ...view.renderArgs })
  }

  goToLearningAndWorkProgressPlan: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    return res.redirectWithSuccess(
      `/plan/${prisonNumber}/view/overview`,
      'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>',
    )
  }
}
