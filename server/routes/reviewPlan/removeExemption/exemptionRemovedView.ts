import type { ActionPlanReviews, PrisonerSummary } from 'viewModels'

export default class ExemptionRemovedView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlanReviews: ActionPlanReviews,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    nextReviewDate: Date
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      nextReviewDate: this.actionPlanReviews.latestReviewSchedule.reviewDateTo,
    }
  }
}
