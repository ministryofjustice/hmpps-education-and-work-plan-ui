import type { AddNoteForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class AddNoteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly addNoteForm: AddNoteForm,
    private readonly isEditMode: boolean,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: AddNoteForm
    isEditMode: boolean
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.addNoteForm,
      isEditMode: this.isEditMode,
      errors: this.errors || [],
    }
  }
}
