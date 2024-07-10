import type { GoalsOrProblem, PrisonerSummary } from 'viewModels'

export default class ViewArchivedGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goalsOrProblem: GoalsOrProblem,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    goalsOrProblem: GoalsOrProblem
  } {
    return {
      tab: 'view-archived-goals',
      prisonerSummary: this.prisonerSummary,
      goalsOrProblem: this.goalsOrProblem,
    }
  }
}
