import type { PrisonerSummary } from 'viewModels'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'

export default class WhoCompletedReviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly whoCompletedReviewForm: WhoCompletedReviewForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WhoCompletedReviewForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.whoCompletedReviewForm,
    }
  }
}
