import type { PrisonerSummary } from 'viewModels'
import type { QualificationDetailsForm } from 'forms'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

export default class QualificationDetailsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly qualificationDetailsForm: QualificationDetailsForm,
    private readonly qualificationLevel: QualificationLevelValue,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: QualificationDetailsForm
    qualificationLevel: QualificationLevelValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.qualificationDetailsForm,
      qualificationLevel: this.qualificationLevel,
    }
  }
}
