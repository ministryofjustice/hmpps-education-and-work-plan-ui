import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import type { AchievedQualificationDto } from 'dto'

export default class QualificationsListView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly qualifications: Array<AchievedQualificationDto>,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    qualifications: Array<AchievedQualificationDto>
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      qualifications: this.qualifications,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
    }
  }
}
