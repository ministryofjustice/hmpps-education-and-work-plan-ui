import type { Goal, PrisonerGoals, PrisonerSummary } from 'viewModels'

export default class ViewGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly allGoalsForPrisoner: PrisonerGoals,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    problemRetrievingData: boolean
    inProgressGoals: Array<Goal>
    archivedGoals: Array<Goal>
    completedGoals: Array<Goal>
  } {
    return {
      tab: 'goals',
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.allGoalsForPrisoner.problemRetrievingData,
      inProgressGoals: this.allGoalsForPrisoner.goals.ACTIVE,
      archivedGoals: this.allGoalsForPrisoner.goals.ARCHIVED,
      completedGoals: this.allGoalsForPrisoner.goals.COMPLETED,
    }
  }
}
