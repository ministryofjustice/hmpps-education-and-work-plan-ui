import type { ArchiveGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class ArchiveGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly archiveGoalForm: ArchiveGoalForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: ArchiveGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.archiveGoalForm,
    }
  }
}
