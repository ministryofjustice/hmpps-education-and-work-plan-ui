import type { ActionPlanReviews, FunctionalSkills, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import dateComparator from '../dateComparator'

type RenderArgs = {
  tab: string
  prisonerSummary: PrisonerSummary
  functionalSkills: FunctionalSkills
  inPrisonCourses: InPrisonCourseRecords
  actionPlanReviews: ActionPlanReviews
  isPostInduction: boolean
  lastUpdatedBy: string | null
  lastUpdatedDate: Date | null
  lastUpdatedAtPrisonName: string | null
  noGoals: boolean
  goalCounts: { activeCount: number; archivedCount: number; completedCount: number }
  hasWithdrawnOrInProgressCourses: boolean
  hasCoursesCompletedMoreThan12MonthsAgo: boolean
  problemRetrievingData: boolean
  showServiceOnboardingBanner: boolean
  actionPlanReviewsCount: string
}

export default class OverviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly actionPlanReviews: ActionPlanReviews,
    private readonly isPostInduction: boolean,
    private readonly goalData: {
      lastUpdatedBy: string | null
      lastUpdatedDate: Date | null
      lastUpdatedAtPrisonName: string | null
      noGoals: boolean
      goalCounts: { activeCount: number; archivedCount: number; completedCount: number }
    },
    private readonly problemRetrievingData: boolean,
    private readonly showServiceOnboardingBanner: boolean,
    private readonly actionPlanReviewsCount: string,
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
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      actionPlanReviews: this.actionPlanReviews,
      isPostInduction: this.isPostInduction,
      lastUpdatedBy: this.goalData.lastUpdatedBy,
      lastUpdatedDate: this.goalData.lastUpdatedDate,
      lastUpdatedAtPrisonName: this.goalData.lastUpdatedAtPrisonName,
      noGoals: this.goalData.noGoals,
      goalCounts: this.goalData.goalCounts,
      hasWithdrawnOrInProgressCourses: inProgressCourses.length > 0 || withdrawnCourses.length > 0,
      hasCoursesCompletedMoreThan12MonthsAgo,
      problemRetrievingData: this.problemRetrievingData,
      showServiceOnboardingBanner: this.showServiceOnboardingBanner,
      actionPlanReviewsCount: this.actionPlanReviewsCount,
    }
  }
}
