import type { PrisonerSummary } from 'viewModels'
import type { QualificationLevelForm } from 'inductionForms'
import EducationLevelValue from '../../../enums/educationLevelValue'

export default class QualificationLevelView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualificationLevelForm: QualificationLevelForm,
    private readonly educationLevel: EducationLevelValue,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: QualificationLevelForm
    educationLevel: EducationLevelValue
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.qualificationLevelForm,
      educationLevel: this.educationLevel,
      errors: this.errors || [],
    }
  }
}
