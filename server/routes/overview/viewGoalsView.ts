import type { Goal, PrisonerGoals, PrisonerSummary } from 'viewModels'

export default class ViewGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly allGoalsForPrisoner: PrisonerGoals,
    private readonly isInProgressGoalsTab: boolean,
    private readonly currentUrlPath: string,
  ) {}

  get renderArgs(): {
    tab: string
    isInProgressGoalsTab: boolean
    currentUrlPath: string
    prisonerSummary: PrisonerSummary
    problemRetrievingData: boolean
    inProgressGoals: Array<Goal>
    archivedGoals: Array<Goal>
    completedGoals: Array<Goal>
  } {
    return {
      tab: 'goals',
      isInProgressGoalsTab: this.isInProgressGoalsTab,
      currentUrlPath: this.currentUrlPath,
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.allGoalsForPrisoner.problemRetrievingData,
      inProgressGoals: this.allGoalsForPrisoner.goals.ACTIVE,
      archivedGoals: this.allGoalsForPrisoner.goals.ARCHIVED,
      completedGoals: this.allGoalsForPrisoner.goals.COMPLETED,
    }
  }
}
