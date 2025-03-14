import type { PrisonerSummary } from 'viewModels'
import type { WorkInterestRolesForm } from 'inductionForms'

export default class WorkInterestsRoleView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly workInterestRolesForm: WorkInterestRolesForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WorkInterestRolesForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.workInterestRolesForm,
    }
  }
}
