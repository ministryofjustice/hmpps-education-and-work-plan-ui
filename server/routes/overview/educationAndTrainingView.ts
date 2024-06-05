import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    }
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      induction: this.induction,
    }
  }
}
