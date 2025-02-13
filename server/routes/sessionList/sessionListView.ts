import type { SessionsSummary } from 'viewModels'

export default class SessionListView {
  constructor(private readonly sessionsSummary: SessionsSummary) {}

  get renderArgs(): {
    sessionsSummary: SessionsSummary
  } {
    return {
      sessionsSummary: this.sessionsSummary,
    }
  }
}
