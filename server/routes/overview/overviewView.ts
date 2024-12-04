import type {
  ActionPlanReviews,
  Assessment,
  FunctionalSkills,
  InPrisonCourse,
  InPrisonCourseRecords,
  PrisonerGoals,
  PrisonerSummary,
} from 'viewModels'
import { isAfter, isWithinInterval, startOfToday, sub } from 'date-fns'
import type { InductionDto } from 'inductionDto'
import dateComparator from '../dateComparator'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'

type RenderArgs = {
  tab: string
  prisonerSummary: PrisonerSummary
  functionalSkills: {
    problemRetrievingData: boolean
    mostRecentAssessments: Array<Assessment>
  }
  inPrisonCourses: {
    problemRetrievingData: boolean
    coursesCompletedInLast12Months: Array<InPrisonCourse>
    hasWithdrawnOrInProgressCourses: boolean
    hasCoursesCompletedMoreThan12MonthsAgo: boolean
  }
  prisonerGoals: {
    problemRetrievingData: boolean
    counts: {
      totalGoals: number
      activeGoals: number
      archivedGoals: number
      completedGoals: number
    }
    lastUpdatedBy: string | null
    lastUpdatedDate: Date | null
    lastUpdatedAtPrisonName: string | null
  }
  sessionHistory: {
    problemRetrievingData: boolean
    counts: {
      totalSessions: number
      reviewSessions: number
      inductionSessions: number
    }
    lastSessionConductedBy: string | null
    lastSessionConductedAt: Date | null
    lastSessionConductedAtPrison: string | null
  }
  induction: {
    problemRetrievingData: boolean
    isPostInduction: boolean
  }
  actionPlanReview: {
    problemRetrievingData: boolean
    reviewStatus: 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'NO_SCHEDULED_REVIEW'
    reviewDueDate: Date | null
  }
}

export default class OverviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly actionPlanReviews: ActionPlanReviews,
    private readonly prisonerGoals: PrisonerGoals,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
  ) {}

  get renderArgs(): RenderArgs {
    const twelveMonthsAgo = sub(startOfToday(), { months: 12 })
    const hasCoursesCompletedMoreThan12MonthsAgo = !this.inPrisonCourses.problemRetrievingData
      ? this.inPrisonCourses.coursesByStatus.COMPLETED.some(
          inPrisonCourse => inPrisonCourse.courseCompletionDate < twelveMonthsAgo,
        )
      : undefined
    const hasWithdrawnOrInProgressCourses = !this.inPrisonCourses.problemRetrievingData
      ? this.inPrisonCourses.coursesByStatus.WITHDRAWN.length +
          this.inPrisonCourses.coursesByStatus.TEMPORARILY_WITHDRAWN.length +
          this.inPrisonCourses.coursesByStatus.IN_PROGRESS.length >
        0
      : undefined

    const allPrisonerGoals = [
      ...this.prisonerGoals.goals.ACTIVE,
      ...this.prisonerGoals.goals.ARCHIVED,
      ...this.prisonerGoals.goals.COMPLETED,
    ]
    const mostRecentlyUpdatedGoal =
      allPrisonerGoals.length > 0
        ? allPrisonerGoals.reduce((latestGoal, currentGoal) =>
            !latestGoal || currentGoal.updatedAt > latestGoal.updatedAt ? currentGoal : latestGoal,
          )
        : undefined

    const prisonerHasHadInduction = !this.induction.problemRetrievingData && this.induction.inductionDto != null
    const mostRecentReviewSession =
      this.actionPlanReviews?.completedReviews.length > 0
        ? this.actionPlanReviews.completedReviews.reduce((latestReview, currentReview) =>
            !latestReview || currentReview.completedDate > latestReview.completedDate ? currentReview : latestReview,
          )
        : undefined
    const prisonerHasOnlyHadInduction =
      prisonerHasHadInduction && !this.actionPlanReviews?.problemRetrievingData && mostRecentReviewSession == null
    const prisonerHasHadInductionAndAtLeastOneReview = prisonerHasHadInduction && mostRecentReviewSession != null

    const noScheduledReview =
      this.actionPlanReviews?.latestReviewSchedule == null ||
      this.actionPlanReviews?.latestReviewSchedule.status === ActionPlanReviewStatusValue.COMPLETED
    const reviewDateFrom = this.actionPlanReviews?.latestReviewSchedule?.reviewDateFrom
    const reviewDueDate = noScheduledReview ? undefined : this.actionPlanReviews?.latestReviewSchedule?.reviewDateTo

    const today = startOfToday()
    let reviewStatus: 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'NO_SCHEDULED_REVIEW'

    if (noScheduledReview) {
      reviewStatus = 'NO_SCHEDULED_REVIEW'
    } else if (isAfter(today, reviewDueDate)) {
      reviewStatus = 'OVERDUE'
    } else if (isWithinInterval(today, { start: reviewDateFrom, end: reviewDueDate })) {
      reviewStatus = 'DUE'
    } else {
      reviewStatus = 'NOT_DUE'
    }

    let lastSessionConductedBy: string
    let lastSessionConductedAt: Date
    let lastSessionConductedAtPrison: string
    if (prisonerHasOnlyHadInduction) {
      lastSessionConductedBy = this.induction.inductionDto.updatedByDisplayName
      lastSessionConductedAt = this.induction.inductionDto.updatedAt
      lastSessionConductedAtPrison = this.induction.inductionDto.updatedAtPrison
    } else if (prisonerHasHadInductionAndAtLeastOneReview) {
      lastSessionConductedBy = mostRecentReviewSession.createdByDisplayName
      lastSessionConductedAt = mostRecentReviewSession.createdAt
      lastSessionConductedAtPrison = mostRecentReviewSession.createdAtPrison
    }

    return {
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: {
        problemRetrievingData: this.functionalSkills.problemRetrievingData,
        mostRecentAssessments: !this.functionalSkills.problemRetrievingData
          ? mostRecentAssessments(this.functionalSkills.assessments)
          : undefined,
      },
      inPrisonCourses: {
        problemRetrievingData: this.inPrisonCourses.problemRetrievingData,
        coursesCompletedInLast12Months: this.inPrisonCourses.coursesCompletedInLast12Months,
        hasWithdrawnOrInProgressCourses,
        hasCoursesCompletedMoreThan12MonthsAgo,
      },
      sessionHistory: {
        problemRetrievingData: !this.actionPlanReviews
          ? this.induction.problemRetrievingData
          : this.induction.problemRetrievingData || this.actionPlanReviews.problemRetrievingData,
        counts: {
          totalSessions: (prisonerHasHadInduction ? 1 : 0) + (this.actionPlanReviews?.completedReviews.length || 0),
          reviewSessions: this.actionPlanReviews ? this.actionPlanReviews.completedReviews.length : undefined,
          inductionSessions: prisonerHasHadInduction ? 1 : 0,
        },
        lastSessionConductedBy,
        lastSessionConductedAt,
        lastSessionConductedAtPrison,
      },
      induction: {
        problemRetrievingData: this.induction.problemRetrievingData,
        isPostInduction: !this.induction.problemRetrievingData ? this.induction.inductionDto != null : undefined,
      },
      prisonerGoals: {
        problemRetrievingData: this.prisonerGoals.problemRetrievingData,
        counts: {
          activeGoals: this.prisonerGoals.goals.ACTIVE.length,
          archivedGoals: this.prisonerGoals.goals.ARCHIVED.length,
          completedGoals: this.prisonerGoals.goals.COMPLETED.length,
          totalGoals: allPrisonerGoals.length,
        },
        lastUpdatedBy: mostRecentlyUpdatedGoal?.updatedByDisplayName,
        lastUpdatedDate: mostRecentlyUpdatedGoal?.updatedAt,
        lastUpdatedAtPrisonName: mostRecentlyUpdatedGoal?.updatedAtPrisonName,
      },
      actionPlanReview: {
        problemRetrievingData: this.actionPlanReviews == null ? false : this.actionPlanReviews.problemRetrievingData,
        reviewStatus,
        reviewDueDate,
      },
    }
  }
}

const mostRecentAssessments = (allAssessments: Array<Assessment>): Array<Assessment> => {
  const allAssessmentsGroupedByTypeSortedByDateDesc = assessmentsGroupedByTypeSortedByDateDesc(allAssessments)

  const latestEnglishAssessment = (
    allAssessmentsGroupedByTypeSortedByDateDesc.get('ENGLISH') || [{ type: 'ENGLISH' } as Assessment]
  ).at(0)
  const latestMathsAssessment = (
    allAssessmentsGroupedByTypeSortedByDateDesc.get('MATHS') || [{ type: 'MATHS' } as Assessment]
  ).at(0)
  const latestOtherAssessments = [...allAssessmentsGroupedByTypeSortedByDateDesc.keys()]
    .filter(key => key !== 'ENGLISH' && key !== 'MATHS')
    .map(key => allAssessmentsGroupedByTypeSortedByDateDesc.get(key).at(0))

  return [latestEnglishAssessment, latestMathsAssessment, ...latestOtherAssessments]
}

const assessmentsGroupedByTypeSortedByDateDesc = (assessments: Array<Assessment>): Map<string, Array<Assessment>> => {
  const map = new Map<string, Array<Assessment>>()
  assessments.forEach(assessment => {
    const key = assessment.type
    const value: Array<Assessment> = map.get(key) || []
    value.push(assessment)
    map.set(
      key,
      value.sort((left: Assessment, right: Assessment) => dateComparator(left.assessmentDate, right.assessmentDate)),
    )
  })
  return map
}
