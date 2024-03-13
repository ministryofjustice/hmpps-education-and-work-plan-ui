import type { PrisonerSummary } from 'viewModels'
import type { QualificationLevelForm } from 'inductionForms'

export default class QualificationLevelView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualificationLevelForm: QualificationLevelForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: QualificationLevelForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.qualificationLevelForm,
      errors: this.errors || [],
    }
  }
}
