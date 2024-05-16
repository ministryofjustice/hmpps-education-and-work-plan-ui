import type { PrisonerSummary } from 'viewModels'
import type { AdditionalTrainingForm } from 'inductionForms'

export default class AdditionalTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly additionalTrainingForm: AdditionalTrainingForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: AdditionalTrainingForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.additionalTrainingForm,
    }
  }
}
