import createError from 'http-errors'
import type { Request, RequestHandler } from 'express'
import ConfirmExemptionView from './confirmExemptionView'
import { AuditService, InductionService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'

export default class ConfirmExemptionController {
  constructor(
    private readonly inductionService: InductionService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { inductionExemptionDto } = req.journeyData

    const view = new ConfirmExemptionView(prisonerSummary, inductionExemptionDto)
    return res.render('pages/induction/exemption/confirmExemption/index', {
      ...view.renderArgs,
    })
  }

  submitConfirmExemption: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params

    try {
      const { inductionExemptionDto } = req.journeyData
      await this.inductionService.updateInductionScheduleStatus(inductionExemptionDto, req.user.username)

      this.auditService.logExemptInduction(exemptInductionAuditData(req)) // no need to wait for response
      return res.redirect(`/prisoners/${prisonNumber}/induction/${journeyId}/exemption/recorded`)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error exempting Induction for prisoner ${prisonNumber}`))
    }
  }
}

const exemptInductionAuditData = (req: Request): BaseAuditData => {
  return {
    details: {},
    subjectType: 'PRISONER_ID',
    subjectId: req.params.prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
