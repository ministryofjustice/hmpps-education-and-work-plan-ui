import type { Request, RequestHandler } from 'express'
import { AuditService, ReviewService } from '../../../services'
import { BaseAuditData } from '../../../services/auditService'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'
import { Result } from '../../../utils/result/result'
import logger from '../../../../logger'

export default class ConfirmExemptionController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmExemptionView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { reviewExemptionDto } = req.journeyData

    clearRedirectPendingFlag(req)

    return res.render('pages/reviewPlan/exemption/confirmExemption/index', { prisonerSummary, reviewExemptionDto })
  }

  submitConfirmExemption: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { reviewExemptionDto } = req.journeyData

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.reviewService.updateActionPlanReviewScheduleStatus(reviewExemptionDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error exempting Action Plan Review for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    this.auditService.logExemptActionPlanReview(exemptActionPlanReviewAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirect('recorded')
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
