import { type Request, RequestHandler } from 'express'
import createError from 'http-errors'
import type { CreatedActionPlanReview } from 'viewModels'
import type { ReviewPlanDto } from 'dto'
import ReviewCheckYourAnswersView from './reviewCheckYourAnswersView'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import { AuditService, ReviewService } from '../../../services'
import { BaseAuditData } from '../../../services/auditService'
import { buildNewPageFlowHistory } from '../../pageFlowHistory'

export default class ReviewCheckYourAnswersController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly auditService: AuditService,
  ) {}

  getReviewCheckYourAnswersView: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber } = req.params
    const { prisonerSummary } = res.locals
    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)

    req.session.pageFlowHistory = buildNewPageFlowHistory(req)

    const view = new ReviewCheckYourAnswersView(prisonerSummary, reviewPlanDto)
    return res.render('pages/reviewPlan/review/checkYourAnswers/index', { ...view.renderArgs })
  }

  submitCheckYourAnswers: RequestHandler = async (req, res, next): Promise<void> => {
    const { prisonNumber, journeyId } = req.params
    const { reviewPlanDto } = getPrisonerContext(req.session, prisonNumber)

    try {
      const createdActionPlan = await this.reviewService.createActionPlanReview(reviewPlanDto, req.user.username)

      const updatedReviewPlanDto = updateReviewPlanDtoWithNextReviewDates(reviewPlanDto, createdActionPlan)
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = updatedReviewPlanDto

      this.auditService.logCreateActionPlanReview(createActionPlanReviewAuditData(req)) // no need to wait for response
      return res.redirect(`/plan/${prisonNumber}/${journeyId}/review/complete`)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return next(createError(500, `Error creating Action Plan Review for prisoner ${prisonNumber}`))
    }
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
