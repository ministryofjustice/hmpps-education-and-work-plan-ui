import type { PrisonerSummary } from 'viewModels'
import type { QualificationDetailsForm } from 'inductionForms'
import QualificationLevelValue from '../../../enums/qualificationLevelValue'

export default class QualificationDetailsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualificationDetailsForm: QualificationDetailsForm,
    private readonly qualificationLevel: QualificationLevelValue,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: QualificationDetailsForm
    qualificationLevel: QualificationLevelValue
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.qualificationDetailsForm,
      qualificationLevel: this.qualificationLevel,
      errors: this.errors || [],
    }
  }
}
