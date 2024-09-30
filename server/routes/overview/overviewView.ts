import type { FunctionalSkills, InPrisonCourse, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import dateComparator from '../dateComparator'

type RenderArgs = {
  prisonNumber: string
  tab: string
  prisonerSummary: PrisonerSummary
  functionalSkills: FunctionalSkills
  inPrisonCourses: InPrisonCourseRecords
  isPostInduction: boolean
  lastUpdatedBy: string | null
  lastUpdatedDate: Date | null
  lastUpdatedAtPrisonName: string | null
  noGoals: boolean
  goalCounts: { activeCount: number; archivedCount: number; completedCount: number }
  completedCourses: Array<InPrisonCourse>
  inProgressCourses: Array<InPrisonCourse>
  withdrawnCourses: Array<InPrisonCourse>
  hasWithdrawnOrInProgressCourses: boolean
  hasCoursesCompletedMoreThan12MonthsAgo: boolean
}

export default class OverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly isPostInduction: boolean,
    private readonly goalData: {
      lastUpdatedBy: string | null
      lastUpdatedDate: Date | null
      lastUpdatedAtPrisonName: string | null
      noGoals: boolean
      goalCounts: { activeCount: number; archivedCount: number; completedCount: number }
    },
  ) {}

  get renderArgs(): RenderArgs {
    const completedCourses = [...(this.inPrisonCourses.coursesByStatus?.COMPLETED || [])].sort((left, right) =>
      dateComparator(left.courseCompletionDate, right.courseCompletionDate, 'DESC'),
    )

    const inProgressCourses = [...(this.inPrisonCourses.coursesByStatus?.IN_PROGRESS || [])].sort((left, right) =>
      dateComparator(left.courseStartDate, right.courseStartDate, 'DESC'),
    )

    const withdrawnCourses = [
      ...(this.inPrisonCourses.coursesByStatus?.WITHDRAWN || []).concat(
        this.inPrisonCourses.coursesByStatus?.TEMPORARILY_WITHDRAWN || [],
      ),
    ].sort((left, right) => dateComparator(left.courseStartDate, right.courseStartDate, 'DESC'))

    const hasCoursesCompletedMoreThan12MonthsAgo = completedCourses.some(inPrisonCourse => {
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      return inPrisonCourse.courseCompletionDate < twelveMonthsAgo
    })

    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      isPostInduction: this.isPostInduction,
      lastUpdatedBy: this.goalData.lastUpdatedBy,
      lastUpdatedDate: this.goalData.lastUpdatedDate,
      lastUpdatedAtPrisonName: this.goalData.lastUpdatedAtPrisonName,
      noGoals: this.goalData.noGoals,
      goalCounts: this.goalData.goalCounts,
      completedCourses,
      inProgressCourses,
      withdrawnCourses,
      hasWithdrawnOrInProgressCourses: inProgressCourses.length > 0 || withdrawnCourses.length > 0,
      hasCoursesCompletedMoreThan12MonthsAgo,
    }
  }
}
