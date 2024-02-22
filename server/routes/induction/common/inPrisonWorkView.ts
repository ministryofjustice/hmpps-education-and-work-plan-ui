import type { PrisonerSummary } from 'viewModels'
import type { InPrisonWorkForm } from 'inductionForms'

export default class InPrisonWorkView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly inPrisonWorkForm: InPrisonWorkForm,
    private readonly formValues: Array<{ value: string; text: string }>,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: InPrisonWorkForm
    formValues: Array<{ value: string; text: string }>
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.inPrisonWorkForm,
      formValues: this.formValues,
      errors: this.errors || [],
    }
  }
}
