import type { PrisonerSummary } from 'viewModels'
import type { ReviewNoteForm } from 'reviewPlanForms'

export default class ReviewNoteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly reviewNoteForm: ReviewNoteForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: ReviewNoteForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.reviewNoteForm,
    }
  }
}
