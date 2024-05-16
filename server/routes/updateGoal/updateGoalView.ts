import type { UpdateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class UpdateGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly updateGoalForm: UpdateGoalForm,
    private readonly goalTargetDate: { text: string; value: string },
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: UpdateGoalForm
    goalTargetDate: { text: string; value: string }
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.updateGoalForm,
      goalTargetDate: this.goalTargetDate,
    }
  }
}
