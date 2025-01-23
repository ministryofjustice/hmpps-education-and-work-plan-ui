import type { InductionExemptionForm } from 'inductionForms'
import type { PrisonerSummary } from 'viewModels'

export default class ExemptionReasonView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly exemptionReasonForm: InductionExemptionForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: InductionExemptionForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.exemptionReasonForm,
    }
  }
}
