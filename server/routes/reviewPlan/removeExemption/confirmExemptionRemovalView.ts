import type { ActionPlanReviews, PrisonerSummary } from 'viewModels'
import ReviewPlanExemptionReasonValue from '../../../enums/reviewPlanExemptionReasonValue'

export default class ConfirmExemptionRemovalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlanReviews: ActionPlanReviews,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    exemptionReason: ReviewPlanExemptionReasonValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      exemptionReason: this.actionPlanReviews.latestReviewSchedule.status,
    }
  }
}
