import type { FunctionalSkills, InPrisonEducationRecords, OtherQualifications, PrisonerSummary } from 'viewModels'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly completedInPrisonEducation: InPrisonEducationRecords,
    private readonly otherQualifications: OtherQualifications,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
    otherQualifications: OtherQualifications
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
      otherQualifications: this.otherQualifications,
    }
  }
}
