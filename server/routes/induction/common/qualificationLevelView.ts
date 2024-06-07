import type { PrisonerSummary } from 'viewModels'
import type { QualificationLevelForm } from 'inductionForms'

export default class QualificationLevelView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualificationLevelForm: QualificationLevelForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: QualificationLevelForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.qualificationLevelForm,
    }
  }
}
