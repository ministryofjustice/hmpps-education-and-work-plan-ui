import type { PrisonerSummary } from 'viewModels'
import type { ReasonsNotToGetWorkForm } from 'inductionForms'

export default class ReasonsNotToGetWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly reasonsNotToGetWorkForm: ReasonsNotToGetWorkForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: ReasonsNotToGetWorkForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.reasonsNotToGetWorkForm,
    }
  }
}
