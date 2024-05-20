import type { PrisonerSummary } from 'viewModels'
import type { InPrisonTrainingForm } from 'inductionForms'

export default class InPrisonTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly inPrisonTrainingForm: InPrisonTrainingForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: InPrisonTrainingForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.inPrisonTrainingForm,
    }
  }
}
