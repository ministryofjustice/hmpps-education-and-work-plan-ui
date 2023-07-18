import type { PrisonerSummary, SupportNeeds } from 'viewModels'

export default class OverviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly tab: string,
    private readonly prisonNumber: string,
    private readonly supportNeeds: SupportNeeds,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    prisonNumber: string
    supportNeeds: SupportNeeds
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: this.tab,
      prisonNumber: this.prisonNumber,
      supportNeeds: this.supportNeeds,
    }
  }
}
