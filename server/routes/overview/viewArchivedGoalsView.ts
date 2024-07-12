import type { Goals, PrisonerSummary } from 'viewModels'

export default class ViewArchivedGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goals: Goals,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    goals: Goals
  } {
    return {
      tab: 'view-archived-goals',
      prisonerSummary: this.prisonerSummary,
      goals: this.goals,
    }
  }
}
