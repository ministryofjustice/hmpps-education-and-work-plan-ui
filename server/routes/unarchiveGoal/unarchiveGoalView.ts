import type { UnarchiveGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class UnarchiveGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly archiveGoalForm: UnarchiveGoalForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: UnarchiveGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.archiveGoalForm,
    }
  }
}
