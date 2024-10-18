import type { CompleteOrArchiveGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class CompleteOrArchiveGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly completeOrArchiveGoalForm: CompleteOrArchiveGoalForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CompleteOrArchiveGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.completeOrArchiveGoalForm,
    }
  }
}
