import type { PrisonerSummary } from 'viewModels'
import type { AdditionalTrainingForm } from 'inductionForms'

export default class AdditionalTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly additionalTrainingForm: AdditionalTrainingForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: AdditionalTrainingForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.additionalTrainingForm,
    }
  }
}
