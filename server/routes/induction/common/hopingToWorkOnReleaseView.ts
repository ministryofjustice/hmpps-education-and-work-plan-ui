import type { PrisonerSummary } from 'viewModels'
import type { HopingToWorkOnReleaseForm } from 'inductionForms'

export default class HopingToWorkOnReleaseView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: HopingToWorkOnReleaseForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.hopingToWorkOnReleaseForm,
    }
  }
}
