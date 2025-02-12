import type { SessionsSummary } from 'viewModels'

export default class SessionSummaryView {
  constructor(private readonly sessionsSummary: SessionsSummary) {}

  get renderArgs(): {
    sessionsSummary: SessionsSummary
  } {
    return {
      sessionsSummary: this.sessionsSummary,
    }
  }
}
