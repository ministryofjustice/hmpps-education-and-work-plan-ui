import type { PrisonerSummary } from 'viewModels'
import type { InPrisonWorkForm } from 'inductionForms'

export default class InPrisonWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inPrisonWorkForm: InPrisonWorkForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: InPrisonWorkForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.inPrisonWorkForm,
    }
  }
}
