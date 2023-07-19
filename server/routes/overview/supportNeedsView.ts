import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'

export default class SupportNeedsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly tab: string,
    private readonly prisonNumber: string,
    private readonly supportNeeds: PrisonerSupportNeeds,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    prisonNumber: string
    supportNeeds: PrisonerSupportNeeds
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: this.tab,
      prisonNumber: this.prisonNumber,
      supportNeeds: this.supportNeeds,
    }
  }
}
