import type { ReviewExemptionForm } from 'reviewPlanForms'
import type { PrisonerSummary } from 'viewModels'

export default class ExemptionReasonView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly exemptionReasonForm: ReviewExemptionForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: ReviewExemptionForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.exemptionReasonForm,
    }
  }
}
