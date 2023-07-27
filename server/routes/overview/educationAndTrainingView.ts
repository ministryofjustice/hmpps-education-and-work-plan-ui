import type { FunctionalSkills, PrisonerSummary } from 'viewModels'
import { mostRecentFunctionalSkills } from './mappers/functionalSkillsMapper'

export default class EducationAndTrainingView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly functionalSkills: FunctionalSkills) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: mostRecentFunctionalSkills(this.functionalSkills),
    }
  }
}
