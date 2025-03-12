import type { PrisonerSummary } from 'viewModels'
import type { WorkedBeforeForm } from 'inductionForms'

export default class WorkedBeforeView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly workedBeforeForm: WorkedBeforeForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WorkedBeforeForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.workedBeforeForm,
    }
  }
}
