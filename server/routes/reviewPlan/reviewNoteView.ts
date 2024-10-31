import type { PrisonerSummary } from 'viewModels'
import type { ReviewNoteForm } from 'reviewPlanForms'

export default class ReviewNoteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly reviewNoteForm: ReviewNoteForm,
    private readonly backlinkUrl: string,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: ReviewNoteForm
    backlinkUrl: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.reviewNoteForm,
      backlinkUrl: this.backlinkUrl,
    }
  }
}
