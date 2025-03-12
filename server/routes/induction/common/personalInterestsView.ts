import type { PrisonerSummary } from 'viewModels'
import type { PersonalInterestsForm } from 'inductionForms'

export default class PersonalInterestsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly personalInterestsForm: PersonalInterestsForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: PersonalInterestsForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.personalInterestsForm,
    }
  }
}
