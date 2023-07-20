import type { PrisonerSummary } from 'viewModels'

export default class OverviewView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly prisonNumber: string) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    prisonNumber: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: 'overview',
      prisonNumber: this.prisonNumber,
    }
  }
}
