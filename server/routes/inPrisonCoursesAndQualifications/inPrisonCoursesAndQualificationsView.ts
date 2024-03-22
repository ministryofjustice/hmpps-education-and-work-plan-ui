import type { InPrisonCourse, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import dateComparator from '../dateComparator'

export default class InPrisonCoursesAndQualificationsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inPrisonCourses: InPrisonCourseRecords,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    problemRetrievingData: boolean
    completedCourses: Array<InPrisonCourse>
    inProgressCourses: Array<InPrisonCourse>
    withdrawnCourses: Array<InPrisonCourse>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      problemRetrievingData: this.inPrisonCourses.problemRetrievingData,
      completedCourses: [...(this.inPrisonCourses.coursesByStatus?.COMPLETED || [])].sort((left, right) =>
        dateComparator(left.courseCompletionDate, right.courseCompletionDate, 'DESC'),
      ),
      inProgressCourses: [...(this.inPrisonCourses.coursesByStatus?.IN_PROGRESS || [])].sort((left, right) =>
        dateComparator(left.courseStartDate, right.courseStartDate, 'DESC'),
      ),
      withdrawnCourses: [
        ...(this.inPrisonCourses.coursesByStatus?.WITHDRAWN || []).concat(
          this.inPrisonCourses.coursesByStatus?.TEMPORARILY_WITHDRAWN || [],
        ),
      ].sort((left, right) => dateComparator(left.courseStartDate, right.courseStartDate, 'DESC')),
    }
  }
}
