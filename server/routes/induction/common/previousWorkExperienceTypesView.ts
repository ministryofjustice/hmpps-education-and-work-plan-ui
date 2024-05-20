import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'

export default class PreviousWorkExperienceTypesView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PreviousWorkExperienceTypesForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.previousWorkExperienceTypesForm,
    }
  }
}
