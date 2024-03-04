import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'

export default class PreviousWorkExperienceTypesView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PreviousWorkExperienceTypesForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.previousWorkExperienceTypesForm,
      errors: this.errors || [],
    }
  }
}
