import type { ActionPlan, FunctionalSkills, InPrisonEducationRecords, PrisonerSummary } from 'viewModels'

export default class OverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlan: ActionPlan,
    private readonly functionalSkills: FunctionalSkills,
    private readonly completedInPrisonEducation: InPrisonEducationRecords,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    actionPlan: ActionPlan
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      actionPlan: this.actionPlan,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
    }
  }
}
