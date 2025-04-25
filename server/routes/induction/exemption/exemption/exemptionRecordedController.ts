import { NextFunction, Request, RequestHandler, Response } from 'express'
import ExemptionRecordedView from './exemptionRecordedView'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'

export default class ExemptionRecordedController {
  getExemptionRecordedView: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { prisonerSummary, inductionSchedule } = res.locals

    const { inductionExemptionDto } = req.journeyData
    const exemptionDueToTechnicalIssue =
      inductionExemptionDto.exemptionReason === InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE

    const view = new ExemptionRecordedView(prisonerSummary, inductionSchedule, exemptionDueToTechnicalIssue)
    return res.render('pages/induction/exemption/exemptionRecorded/index', { ...view.renderArgs })
  }

  submitExemptionRecorded: RequestHandler = async (req, res): Promise<void> => {
    const { prisonNumber } = req.params
    const { inductionExemptionDto } = req.journeyData

    const exemptionDueToTechnicalIssue =
      inductionExemptionDto.exemptionReason === InductionScheduleStatusValue.EXEMPT_SYSTEM_TECHNICAL_ISSUE
    const successMessage = exemptionDueToTechnicalIssue
      ? 'Exemption recorded.'
      : 'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>'

    return res.redirectWithSuccess(`/plan/${prisonNumber}/view/overview`, successMessage)
  }
}
