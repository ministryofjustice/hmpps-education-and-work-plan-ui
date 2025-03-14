import type { PrisonerSummary } from 'viewModels'
import type { HighestLevelOfEducationForm } from 'forms'

export default class HighestLevelOfEducationView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly highestLevelOfEducationForm: HighestLevelOfEducationForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: HighestLevelOfEducationForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.highestLevelOfEducationForm,
    }
  }
}
