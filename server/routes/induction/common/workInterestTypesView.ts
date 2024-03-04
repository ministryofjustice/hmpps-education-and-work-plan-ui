import type { PrisonerSummary } from 'viewModels'
import type { WorkInterestTypesForm } from 'inductionForms'

export default class AffectAbilityToWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly workInterestTypesForm: WorkInterestTypesForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: WorkInterestTypesForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.workInterestTypesForm,
      errors: this.errors || [],
    }
  }
}
