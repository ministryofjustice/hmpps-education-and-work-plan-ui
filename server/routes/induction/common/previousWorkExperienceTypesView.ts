import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceTypesForm } from 'inductionForms'

export default class PreviousWorkExperienceTypesView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: PreviousWorkExperienceTypesForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.previousWorkExperienceTypesForm,
    }
  }
}
