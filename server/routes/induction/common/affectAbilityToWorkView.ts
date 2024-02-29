import type { PrisonerSummary } from 'viewModels'
import type { AffectAbilityToWorkForm } from 'inductionForms'

export default class AffectAbilityToWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly abilityToWorkForm: AffectAbilityToWorkForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: AffectAbilityToWorkForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.abilityToWorkForm,
      errors: this.errors || [],
    }
  }
}
