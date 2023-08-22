import type { FunctionalSkills, InPrisonEducationRecords, PrePrisonQualifications, PrisonerSummary } from 'viewModels'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly completedInPrisonEducation: InPrisonEducationRecords,
    private readonly prePrisonQualifications: PrePrisonQualifications,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
    prePrisonQualifications: PrePrisonQualifications
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
      prePrisonQualifications: this.prePrisonQualifications,
    }
  }
}
