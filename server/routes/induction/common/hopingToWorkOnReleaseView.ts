import type { PrisonerSummary } from 'viewModels'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'

export default class HopingToWorkOnReleaseView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: HopingToWorkOnReleaseForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.hopingToWorkOnReleaseForm,
    }
  }
}
