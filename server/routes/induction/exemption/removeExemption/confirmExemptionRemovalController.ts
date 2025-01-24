import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { InductionExemptionDto } from 'inductionDto'
import { AuditService, InductionService } from '../../../../services'
import ConfirmExemptionRemovalView from './confirmExemptionRemovalView'
import { BaseAuditData } from '../../../../services/auditService'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'

export default class ConfirmExemptionRemovalController {
  constructor(
    private readonly inductionService: InductionService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionRemovalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, inductionSchedule } = res.locals

    const view = new ConfirmExemptionRemovalView(prisonerSummary, inductionSchedule)
    return res.render('pages/induction/removeExemption/confirmRemoval/index', {
      ...view.renderArgs,
    })
  }

  submitConfirmExemptionRemoval: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = res.locals.prisonerSummary

    try {
      await this.inductionService.updateInductionScheduleStatus(
        dtoToClearExemption(prisonNumber, prisonId),
        req.user.username,
      )

      this.auditService.logRemoveExemptionInduction(removeInductionExemptionAuditData(req)) // no need to wait for response
      return res.redirect(`/prisoners/${prisonNumber}/induction/exemption/removed`)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error removing exemption for Induction for prisoner ${prisonNumber}`))
    }
  }
}

const removeInductionExemptionAuditData = (req: Request): BaseAuditData => {
  return {
    details: {},
    subjectType: 'PRISONER_ID',
    subjectId: req.params.prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}

const dtoToClearExemption = (prisonNumber: string, prisonId: string): InductionExemptionDto => ({
  prisonNumber,
  prisonId,
  exemptionReason: InductionScheduleStatusValue.SCHEDULED,
  exemptionReasonDetails: undefined as string,
})
