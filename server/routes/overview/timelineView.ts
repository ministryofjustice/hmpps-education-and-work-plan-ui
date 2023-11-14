import type { PrisonerSummary } from 'viewModels'

export default class TimelineView {
  constructor(private readonly prisonerSummary: PrisonerSummary) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
  } {
    return {
      tab: 'timeline',
      prisonerSummary: this.prisonerSummary,
    }
  }
}
