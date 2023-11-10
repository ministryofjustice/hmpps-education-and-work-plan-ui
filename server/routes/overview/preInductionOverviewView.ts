import type { FunctionalSkills, InPrisonEducationRecords, PrisonerSummary } from 'viewModels'

export default class PreInductionOverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly completedInPrisonEducation: InPrisonEducationRecords,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
    isPostInduction: boolean
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
      isPostInduction: false,
    }
  }
}
