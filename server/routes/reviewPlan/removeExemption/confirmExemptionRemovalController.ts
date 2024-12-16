import type { Request, RequestHandler } from 'express'
import createError from 'http-errors'
import { AuditService, ReviewService } from '../../../services'
import ConfirmExemptionRemovalView from './confirmExemptionRemovalView'
import { BaseAuditData } from '../../../services/auditService'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'

export default class ConfirmExemptionRemovalController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionRemovalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, actionPlanReviews } = res.locals

    // TODO - add validation that the review is in an exempt state and that it is possible to remove the exemption

    const view = new ConfirmExemptionRemovalView(prisonerSummary, actionPlanReviews)
    return res.render('pages/reviewPlan/removeExemption/confirmRemoval/index', {
      ...view.renderArgs,
    })
  }

  submitConfirmExemptionRemoval: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = res.locals.prisonerSummary

    try {
      await this.reviewService.updateActionPlanReviewScheduleStatus(
        dtoToClearExemption(prisonNumber, prisonId),
        req.user.username,
      )

      this.auditService.logRemoveExemptionActionPlanReview(exemptActionPlanReviewAuditData(req)) // no need to wait for response
      return res.redirect(`/plan/${prisonNumber}/review/exemption/removed`)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error removing exemption for Action Plan Review for prisoner ${prisonNumber}`))
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

const dtoToClearExemption = (prisonNumber: string, prisonId: string) => ({
  prisonNumber,
  prisonId,
  exemptionReason: ReviewScheduleStatusValue.SCHEDULED,
  exemptionReasonDetails: undefined as string,
})
