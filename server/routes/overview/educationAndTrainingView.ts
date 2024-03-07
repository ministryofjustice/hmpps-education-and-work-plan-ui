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
    private readonly completedEducationRecordsWithinLast12Months: InPrisonEducation[],
    private readonly educationAndTraining: EducationAndTraining,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    completedInPrisonEducation: InPrisonEducationRecords
    completedEducationRecordsWithinLast12Months: InPrisonEducation[]
    educationAndTraining: EducationAndTraining
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      completedInPrisonEducation: this.completedInPrisonEducation,
      completedEducationRecordsWithinLast12Months: this.completedEducationRecordsWithinLast12Months,
      educationAndTraining: this.educationAndTraining,
    }
  }
}
