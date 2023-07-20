import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'

export default class SupportNeedsView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly supportNeeds: PrisonerSupportNeeds) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    supportNeeds: PrisonerSupportNeeds
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: 'support-needs',
      supportNeeds: this.supportNeeds,
    }
  }
}
