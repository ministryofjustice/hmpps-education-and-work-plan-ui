import type { FunctionalSkills, PrisonerSummary } from 'viewModels'

export default class AllFunctionalSkillsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly latestFunctionalSkills: FunctionalSkills,
    private readonly allFunctionalSkills: FunctionalSkills,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    latestFunctionalSkills: FunctionalSkills
    allFunctionalSkills: FunctionalSkills
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      latestFunctionalSkills: this.latestFunctionalSkills,
      allFunctionalSkills: this.allFunctionalSkills,
    }
  }
}
