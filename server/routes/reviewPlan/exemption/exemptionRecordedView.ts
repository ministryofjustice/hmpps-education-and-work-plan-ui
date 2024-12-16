import type { ActionPlanReviews, PrisonerSummary } from 'viewModels'

export default class ExemptionRecordedView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlanReviews: ActionPlanReviews,
    private readonly exemptionDueToTechnicalIssue: boolean,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    nextReviewDate: Date
    exemptionDueToTechnicalIssue: boolean
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      nextReviewDate: this.actionPlanReviews.latestReviewSchedule.reviewDateTo,
      exemptionDueToTechnicalIssue: this.exemptionDueToTechnicalIssue,
    }
  }
}
