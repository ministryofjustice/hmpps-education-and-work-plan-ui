import type { PrisonerSummary, Assessment } from 'viewModels'

export default class FunctionalSkillsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly problemRetrievingData: boolean,
    private readonly englishSkills: Array<Assessment>,
    private readonly mathsSkills: Array<Assessment>,
    private readonly digitalSkills: Array<Assessment>,
    private readonly showServiceOnboardingBanner: boolean,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    problemRetrievingData: boolean
    englishSkills: Array<Assessment>
    mathsSkills: Array<Assessment>
    digitalSkills: Array<Assessment>
    showServiceOnboardingBanner: boolean
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.problemRetrievingData,
      englishSkills: this.englishSkills,
      mathsSkills: this.mathsSkills,
      digitalSkills: this.digitalSkills,
      showServiceOnboardingBanner: this.showServiceOnboardingBanner,
    }
  }
}
