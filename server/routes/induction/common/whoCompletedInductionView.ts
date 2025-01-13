import type { PrisonerSummary } from 'viewModels'
import type { WhoCompletedInductionForm } from 'inductionForms'

export default class WhoCompletedInductionView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly whoCompletedInductionForm: WhoCompletedInductionForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WhoCompletedInductionForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.whoCompletedInductionForm,
    }
  }
}
