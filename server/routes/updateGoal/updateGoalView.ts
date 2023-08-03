import type { UpdateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class UpdateGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly updateGoalForm: UpdateGoalForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: UpdateGoalForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.updateGoalForm,
      errors: this.errors || [],
    }
  }
}
