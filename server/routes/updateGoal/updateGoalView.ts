import type { UpdateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class UpdateGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly updateGoalForm: UpdateGoalForm,
    private readonly goalTargetDate: { text: string; value: string },
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: UpdateGoalForm
    goalTargetDate: { text: string; value: string }
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.updateGoalForm,
      goalTargetDate: this.goalTargetDate,
      errors: this.errors || [],
    }
  }
}
