import type { PrisonerSummary } from 'viewModels'
import type { AdditionalTrainingForm } from 'inductionForms'

export default class AdditionalTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly additionalTrainingForm: AdditionalTrainingForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: AdditionalTrainingForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.additionalTrainingForm,
      errors: this.errors || [],
    }
  }
}
