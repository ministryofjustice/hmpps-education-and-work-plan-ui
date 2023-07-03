import type { CreateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class AddNoteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalForm: CreateGoalForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalForm,
      errors: this.errors || [],
    }
  }
}
