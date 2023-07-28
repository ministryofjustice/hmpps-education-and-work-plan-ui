import type { ActionPlan, FunctionalSkills, PrisonerSummary } from 'viewModels'

export default class OverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlan: ActionPlan,
    private readonly functionalSkills: FunctionalSkills,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    actionPlan: ActionPlan
    functionalSkills: FunctionalSkills
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      actionPlan: this.actionPlan,
      functionalSkills: this.functionalSkills,
    }
  }
}
