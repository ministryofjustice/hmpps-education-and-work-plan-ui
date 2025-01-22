import type { Assessment, InPrisonCourse, PrisonerSummary } from 'viewModels'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

type OverviewViewRenderArgs = {
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
      totalCompletedSessions: number
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
  inductionSchedule: InductionScheduleView
  actionPlanReview: ActionPlanReviewScheduleView
}

type ActionPlanReviewScheduleView = {
  problemRetrievingData: boolean
  reviewStatus: 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'NO_SCHEDULED_REVIEW' | 'ON_HOLD' | 'HAS_HAD_LAST_REVIEW'
  reviewDueDate?: Date
  exemptionReason?: ActionPlanReviewStatusValue
}

type InductionScheduleView = {
  problemRetrievingData: boolean
  inductionDueDate?: Date
  inductionStatus:
    | 'NO_SCHEDULED_INDUCTION'
    | 'INDUCTION_NOT_DUE'
    | 'GOALS_NOT_DUE'
    | 'INDUCTION_DUE'
    | 'GOALS_DUE'
    | 'INDUCTION_OVERDUE'
    | 'GOALS_OVERDUE'
    | 'ON_HOLD'
    | 'COMPLETE'
  exemptionReason?: InductionScheduleStatusValue
}

export { OverviewViewRenderArgs, ActionPlanReviewScheduleView, InductionScheduleView }
