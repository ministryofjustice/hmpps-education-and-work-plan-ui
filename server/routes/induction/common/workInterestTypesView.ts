import type { PrisonerSummary } from 'viewModels'
import type { WorkInterestTypesForm } from 'inductionForms'

export default class AffectAbilityToWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly workInterestTypesForm: WorkInterestTypesForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: WorkInterestTypesForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.workInterestTypesForm,
    }
  }
}
