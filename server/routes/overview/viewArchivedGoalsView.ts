import type { Goals, PrisonerSummary } from 'viewModels'

export default class ViewArchivedGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goals: Goals,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    goals: Goals
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      goals: this.goals,
    }
  }
}
