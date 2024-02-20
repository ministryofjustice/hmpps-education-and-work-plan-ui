import type { FunctionalSkills, PrisonerSummary, Assessment } from 'viewModels'

export default class FunctionalSkillsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly latestFunctionalSkills: FunctionalSkills,
    private readonly allFunctionalSkills: FunctionalSkills,
    private readonly problemRetrievingData: boolean,
    private readonly englishSkills: Array<Assessment>,
    private readonly mathsSkills: Array<Assessment>,
    private readonly digitalSkills: Array<Assessment>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    latestFunctionalSkills: FunctionalSkills
    allFunctionalSkills: FunctionalSkills
    problemRetrievingData: boolean
    englishSkills: Array<Assessment>
    mathsSkills: Array<Assessment>
    digitalSkills: Array<Assessment>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      latestFunctionalSkills: this.latestFunctionalSkills,
      allFunctionalSkills: this.allFunctionalSkills,
      problemRetrievingData: this.problemRetrievingData,
      englishSkills: this.englishSkills,
      mathsSkills: this.mathsSkills,
      digitalSkills: this.digitalSkills,
    }
  }
}
