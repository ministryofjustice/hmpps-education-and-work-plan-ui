import type { FunctionalSkills, PrisonerSummary } from 'viewModels'

export default class EducationAndTrainingView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly functionalSkills: FunctionalSkills) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    functionalSkills: FunctionalSkills
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: 'education-and-training',
      functionalSkills: this.functionalSkills,
    }
  }
}
