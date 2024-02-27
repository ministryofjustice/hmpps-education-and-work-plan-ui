import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceForm } from 'inductionForms'

export default class PreviousWorkExperienceView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly previousWorkExperienceForm: PreviousWorkExperienceForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PreviousWorkExperienceForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.previousWorkExperienceForm,
      errors: this.errors || [],
    }
  }
}
