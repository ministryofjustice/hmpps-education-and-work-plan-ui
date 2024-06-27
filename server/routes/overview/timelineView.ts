import type { PrisonerSummary, Timeline } from 'viewModels'
import prepareTimelineForView from './prepareTimelineForView'

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
      timeline: prepareTimelineForView(this.timeline),
    }
  }
}
