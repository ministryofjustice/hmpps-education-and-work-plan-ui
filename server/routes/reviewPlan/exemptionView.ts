import type { ExemptionReasonForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class ExemptionReasonView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly exemptionReasonForm: ExemptionReasonForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: ExemptionReasonForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.exemptionReasonForm,
    }
  }
}
