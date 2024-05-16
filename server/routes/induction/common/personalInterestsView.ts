import type { PrisonerSummary } from 'viewModels'
import type { PersonalInterestsForm } from 'inductionForms'

export default class PersonalInterestsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly personalInterestsForm: PersonalInterestsForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PersonalInterestsForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.personalInterestsForm,
    }
  }
}
