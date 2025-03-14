import type { PrisonerSummary } from 'viewModels'
import type { WorkInterestTypesForm } from 'inductionForms'

export default class AffectAbilityToWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly workInterestTypesForm: WorkInterestTypesForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WorkInterestTypesForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.workInterestTypesForm,
    }
  }
}
