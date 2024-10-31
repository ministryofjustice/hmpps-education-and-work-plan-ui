import type { PrisonerSummary } from 'viewModels'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'

export default class WhoCompletedReviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly whoCompletedReviewForm: WhoCompletedReviewForm,
    private readonly backlinkUrl: string,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WhoCompletedReviewForm
    backlinkUrl: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.whoCompletedReviewForm,
      backlinkUrl: this.backlinkUrl,
    }
  }
}
