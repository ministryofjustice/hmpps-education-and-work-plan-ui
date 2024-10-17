import type { CompleteGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class CompleteGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly completeGoalForm: CompleteGoalForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CompleteGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.completeGoalForm,
    }
  }
}
