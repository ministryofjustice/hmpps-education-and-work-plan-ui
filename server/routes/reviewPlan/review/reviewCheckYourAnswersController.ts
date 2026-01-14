import { type Request, RequestHandler } from 'express'
import type { CreatedActionPlanReview } from 'viewModels'
import type { ReviewPlanDto } from 'dto'
import { AuditService, ReviewService } from '../../../services'
import { BaseAuditData } from '../../../services/auditService'
import { Result } from '../../../utils/result/result'
import logger from '../../../../logger'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../../routerRequestHandlers/checkRedirectAtEndOfJourneyIsNotPending'

export default class ReviewCheckYourAnswersController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getReviewCheckYourAnswersView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonerSummary } = res.locals
    const { reviewPlanDto } = req.journeyData

    clearRedirectPendingFlag(req)

    return res.render('pages/reviewPlan/review/checkYourAnswers/index', { prisonerSummary, reviewPlanDto })
  }

  submitCheckYourAnswers: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { reviewPlanDto } = req.journeyData

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.reviewService.createActionPlanReview(reviewPlanDto, req.user.username),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      apiResult.getOrHandle(e => logger.error(`Error creating Action Plan Review for prisoner ${prisonNumber}`, e))
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('check-your-answers')
    }

    const updatedReviewPlanDto = updateReviewPlanDtoWithNextReviewDates(reviewPlanDto, apiResult.getOrNull())
    req.journeyData.reviewPlanDto = updatedReviewPlanDto

    this.auditService.logCreateActionPlanReview(createActionPlanReviewAuditData(req)) // no need to wait for response
    setRedirectPendingFlag(req)
    return res.redirect('complete')
  }
}

const updateReviewPlanDtoWithNextReviewDates = (
  reviewPlanDto: ReviewPlanDto,
  createdActionPlanReview: CreatedActionPlanReview,
) => ({
  ...reviewPlanDto,
  wasLastReviewBeforeRelease: createdActionPlanReview.wasLastReviewBeforeRelease,
  nextReviewDateFrom: !createdActionPlanReview.wasLastReviewBeforeRelease
    ? createdActionPlanReview.latestReviewSchedule.reviewDateFrom
    : undefined,
  nextReviewDateTo: !createdActionPlanReview.wasLastReviewBeforeRelease
    ? createdActionPlanReview.latestReviewSchedule.reviewDateTo
    : undefined,
})

const createActionPlanReviewAuditData = (req: Request): BaseAuditData => {
  return {
    details: {},
    subjectType: 'PRISONER_ID',
    subjectId: req.params.prisonNumber,
    who: req.user?.username ?? 'UNKNOWN',
    correlationId: req.id,
  }
}
