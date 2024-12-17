import createError from 'http-errors'
import type { Request, RequestHandler } from 'express'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import ConfirmExemptionView from './confirmExemptionView'
import { AuditService, ReviewService } from '../../../services'
import { BaseAuditData } from '../../../services/auditService'

export default class ConfirmExemptionController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { reviewExemptionDto } = getPrisonerContext(req.session, prisonNumber)

    const view = new ConfirmExemptionView(prisonerSummary, reviewExemptionDto)
    return res.render('pages/reviewPlan/exemption/confirmExemption/index', {
      ...view.renderArgs,
    })
  }

  submitConfirmExemption: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params

    try {
      const { reviewExemptionDto } = getPrisonerContext(req.session, prisonNumber)
      await this.reviewService.updateActionPlanReviewScheduleStatus(reviewExemptionDto, req.user.username)

      this.auditService.logExemptActionPlanReview(exemptActionPlanReviewAuditData(req)) // no need to wait for response
      return res.redirect(`/plan/${prisonNumber}/review/exemption/recorded`)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error exempting Action Plan Review for prisoner ${prisonNumber}`))
    }
  }
}

const exemptActionPlanReviewAuditData = (req: Request): BaseAuditData => {
  return {
    details: {},
    subjectType: 'PRISONER_ID',
    subjectId: req.params.prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
