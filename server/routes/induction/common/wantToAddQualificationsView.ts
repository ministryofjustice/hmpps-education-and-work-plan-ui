import type { FunctionalSkills, PrisonerSummary } from 'viewModels'
import type { WantToAddQualificationsForm } from 'inductionForms'

export default class WantToAddQualificationsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly wantToAddQualificationsForm: WantToAddQualificationsForm,
    private readonly functionalSkills: FunctionalSkills,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: WantToAddQualificationsForm
    functionalSkills: FunctionalSkills
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.wantToAddQualificationsForm,
      functionalSkills: this.functionalSkills,
    }
  }
}
