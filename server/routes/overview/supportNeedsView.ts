import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'

export default class SupportNeedsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly supportNeeds: PrisonerSupportNeeds,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    supportNeeds: PrisonerSupportNeeds
  } {
    return {
      tab: 'support-needs',
      prisonerSummary: this.prisonerSummary,
      supportNeeds: this.supportNeeds,
    }
  }
}
