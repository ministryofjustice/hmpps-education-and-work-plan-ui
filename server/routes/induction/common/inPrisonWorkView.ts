import type { PrisonerSummary } from 'viewModels'
import type { InPrisonWorkForm } from 'inductionForms'

export default class InPrisonWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly inPrisonWorkForm: InPrisonWorkForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: InPrisonWorkForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.inPrisonWorkForm,
    }
  }
}
