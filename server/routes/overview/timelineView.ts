import type { PrisonerSummary, Timeline } from 'viewModels'

export default class TimelineView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly timeline: Timeline,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    timeline: Timeline
  } {
    return {
      tab: 'timeline',
      prisonerSummary: this.prisonerSummary,
      timeline: this.timeline,
    }
  }
}
