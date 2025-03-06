import type { PrisonerSummary } from 'viewModels'
import type { InPrisonTrainingForm } from 'inductionForms'

export default class InPrisonTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inPrisonTrainingForm: InPrisonTrainingForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: InPrisonTrainingForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.inPrisonTrainingForm,
    }
  }
}
