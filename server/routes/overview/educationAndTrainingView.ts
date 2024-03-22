import type { FunctionalSkills, InPrisonCourseRecords, EducationAndTraining, PrisonerSummary } from 'viewModels'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly educationAndTraining: EducationAndTraining,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    educationAndTraining: EducationAndTraining
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      educationAndTraining: this.educationAndTraining,
    }
  }
}
