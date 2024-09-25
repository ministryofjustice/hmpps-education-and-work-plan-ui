import type { Goal, PrisonerSummary } from 'viewModels'

export default class ViewGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inProgressGoals: Array<Goal>,
    private readonly archivedGoals: Array<Goal>,
    private readonly completedGoals: Array<Goal>,
    private readonly problemRetrievingData: boolean,
  ) {}

  get renderArgs() {
    return {
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.problemRetrievingData,
      inProgressGoals: this.inProgressGoals,
      archivedGoals: this.archivedGoals,
      completedGoals: this.completedGoals,
      tab: 'goals',
    }
  }
}
