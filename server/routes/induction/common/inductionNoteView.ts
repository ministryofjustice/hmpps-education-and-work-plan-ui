import type { PrisonerSummary } from 'viewModels'
import type { InductionNoteForm } from 'inductionForms'

export default class InductionNoteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionNoteForm: InductionNoteForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: InductionNoteForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.inductionNoteForm,
    }
  }
}
