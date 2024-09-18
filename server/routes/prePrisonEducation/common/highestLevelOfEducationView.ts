import type { PrisonerSummary } from 'viewModels'
import type { HighestLevelOfEducationForm } from 'forms'

export default class HighestLevelOfEducationView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly highestLevelOfEducationForm: HighestLevelOfEducationForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: HighestLevelOfEducationForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.highestLevelOfEducationForm,
    }
  }
}
