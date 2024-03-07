import type {
  FunctionalSkills,
  InPrisonEducationRecords,
  EducationAndTraining,
  PrisonerSummary,
  InPrisonEducation,
} from 'viewModels'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly completedInPrisonEducation: InPrisonEducationRecords,
    private readonly completedInPrisonEducationWithinLast12Months: InPrisonEducationRecords,
    private readonly educationAndTraining: EducationAndTraining,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
    completedInPrisonEducationWithinLast12Months: InPrisonEducationRecords
    educationAndTraining: EducationAndTraining
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
      completedInPrisonEducationWithinLast12Months: this.completedInPrisonEducationWithinLast12Months,
      educationAndTraining: this.educationAndTraining,
    }
  }
}
