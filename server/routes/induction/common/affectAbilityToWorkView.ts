import type { PrisonerSummary } from 'viewModels'
import type { AffectAbilityToWorkForm } from 'inductionForms'

export default class AffectAbilityToWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly abilityToWorkForm: AffectAbilityToWorkForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: AffectAbilityToWorkForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.abilityToWorkForm,
    }
  }
}
