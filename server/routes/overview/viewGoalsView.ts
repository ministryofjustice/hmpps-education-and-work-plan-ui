import type { PrisonerSummary } from 'viewModels'

export default class ViewGoalsView {
  constructor(private readonly prisonerSummary: PrisonerSummary) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: 'goals',
    }
  }
}
