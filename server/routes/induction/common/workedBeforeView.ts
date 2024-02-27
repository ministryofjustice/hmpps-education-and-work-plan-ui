import type { PrisonerSummary } from 'viewModels'
import type { WorkedBeforeForm } from 'inductionForms'

export default class WorkedBeforeView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly workedBeforeForm: WorkedBeforeForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: WorkedBeforeForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.workedBeforeForm,
      errors: this.errors || [],
    }
  }
}
