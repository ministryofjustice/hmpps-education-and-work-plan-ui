import type { PrisonerSummary } from 'viewModels'
import type { WorkInterestRolesForm } from 'inductionForms'

export default class WorkInterestsRoleView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly workInterestRolesForm: WorkInterestRolesForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: WorkInterestRolesForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.workInterestRolesForm,
      errors: this.errors || [],
    }
  }
}
