import type { PrisonerSummary } from 'viewModels'
import type { HighestLevelOfEducationForm } from 'inductionForms'

export default class HighestLevelOfEducationView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly highestLevelOfEducationForm: HighestLevelOfEducationForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: HighestLevelOfEducationForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.highestLevelOfEducationForm,
      errors: this.errors || [],
    }
  }
}
