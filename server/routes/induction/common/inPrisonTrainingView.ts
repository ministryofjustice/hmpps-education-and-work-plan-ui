import type { PrisonerSummary } from 'viewModels'
import type { InPrisonTrainingForm } from 'inductionForms'

export default class InPrisonTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly inPrisonTrainingForm: InPrisonTrainingForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: InPrisonTrainingForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.inPrisonTrainingForm,
      errors: this.errors || [],
    }
  }
}
