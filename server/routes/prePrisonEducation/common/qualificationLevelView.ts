import type { PrisonerSummary } from 'viewModels'
import type { QualificationLevelForm } from 'forms'

export default class QualificationLevelView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly qualificationLevelForm: QualificationLevelForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: QualificationLevelForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.qualificationLevelForm,
    }
  }
}
