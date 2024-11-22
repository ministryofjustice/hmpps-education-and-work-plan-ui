import { NextFunction, Request, RequestHandler, Response } from 'express'
import ExemptionRecordedView from './exemptionRecordedView'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ReviewPlanExemptionReasonValue from '../../enums/reviewPlanExemptionReasonValue'

export default class ExemptionRecordedController {
  getExemptionRecordedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const prisonerContext = getPrisonerContext(req.session, prisonNumber)
    const exemptionDueToTechnicalIssue =
      prisonerContext.reviewExemptionDto.exemptionReason ===
      ReviewPlanExemptionReasonValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE

    const view = new ExemptionRecordedView(prisonerSummary, exemptionDueToTechnicalIssue)
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
