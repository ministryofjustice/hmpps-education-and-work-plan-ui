import type { Request, RequestHandler } from 'express'
import { AuditService, ReviewService } from '../../../services'
import { BaseAuditData } from '../../../services/auditService'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'
import { Result } from '../../../utils/result/result'
import logger from '../../../../logger'

export default class ConfirmExemptionRemovalController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionRemovalView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary, actionPlanReviews } = res.locals
    clearRedirectPendingFlag(req)

    // TODO - add validation that the review is in an exempt state and that it is possible to remove the exemption

    return res.render('pages/reviewPlan/removeExemption/confirmRemoval/index', {
      prisonerSummary,
      exemptionReason: actionPlanReviews.latestReviewSchedule.status,
    })
  }

  submitConfirmExemptionRemoval: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonId } = res.locals.prisonerSummary

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.reviewService.updateActionPlanReviewScheduleStatus(
        dtoToClearExemption(prisonNumber, prisonId),
        req.user.username,
      ),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e =>
        logger.error(`Error removing exemption for Action Plan Review for prisoner ${prisonNumber}`, e),
      )
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('remove')
    }

    this.auditService.logRemoveExemptionActionPlanReview(exemptActionPlanReviewAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirect('removed')
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
