import type { PrisonerSummary } from 'viewModels'
import type { QualificationDetailsForm } from 'forms'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

export default class QualificationDetailsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualificationDetailsForm: QualificationDetailsForm,
    private readonly qualificationLevel: QualificationLevelValue,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: QualificationDetailsForm
    qualificationLevel: QualificationLevelValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.qualificationDetailsForm,
      qualificationLevel: this.qualificationLevel,
    }
  }
}
