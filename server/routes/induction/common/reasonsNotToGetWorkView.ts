import type { PrisonerSummary } from 'viewModels'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'

export default class ReasonsNotToGetWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: ReasonsNotToGetWorkForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.reasonsNotToGetWorkForm,
      errors: this.errors || [],
    }
  }
}
