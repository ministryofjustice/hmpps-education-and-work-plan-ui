import type { ActionPlanReviews, InductionSchedule } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import { addMonths, isAfter, isWithinInterval, startOfToday } from 'date-fns'
import type { ActionPlanReviewScheduleView, InductionScheduleView } from './overviewViewTypes'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

const toInductionScheduleView = (
  inductionSchedule?: InductionSchedule,
  induction?: InductionDto,
): InductionScheduleView => {
  const problemRetrievingData = inductionSchedule == null ? false : inductionSchedule.problemRetrievingData
  const inductionStatus = !problemRetrievingData ? workOutInductionStatus(inductionSchedule, induction) : undefined
  return {
    problemRetrievingData,
    inductionDueDate: inductionSchedule?.deadlineDate,
    inductionStatus,
    exemptionReason: inductionStatus === 'ON_HOLD' ? inductionSchedule.scheduleStatus : undefined,
  }
}

const toActionPlanReviewScheduleView = (actionPlanReviews?: ActionPlanReviews): ActionPlanReviewScheduleView => {
  const problemRetrievingData = actionPlanReviews == null ? false : actionPlanReviews.problemRetrievingData
  const reviewDueDate = actionPlanReviews?.latestReviewSchedule?.reviewDateTo
  const reviewStatus = !problemRetrievingData ? workOutReviewStatus(actionPlanReviews) : undefined
  return {
    problemRetrievingData: actionPlanReviews == null ? false : actionPlanReviews.problemRetrievingData,
    reviewStatus,
    reviewDueDate,
    exemptionReason: reviewStatus === 'ON_HOLD' ? actionPlanReviews.latestReviewSchedule.status : undefined,
  }
}

const workOutInductionStatus = (
  inductionSchedule?: InductionSchedule,
  induction?: InductionDto,
):
  | 'NO_SCHEDULED_INDUCTION'
  | 'INDUCTION_NOT_DUE'
  | 'GOALS_NOT_DUE'
  | 'INDUCTION_DUE'
  | 'GOALS_DUE'
  | 'INDUCTION_OVERDUE'
  | 'GOALS_OVERDUE'
  | 'ON_HOLD'
  | 'COMPLETE' => {
  const today = startOfToday()

  const inductionScheduleDoesNotExist = inductionSchedule?.reference == null
  const inductionScheduleStatus = inductionSchedule?.scheduleStatus
  const inductionComplete = inductionScheduleStatus === ActionPlanReviewStatusValue.COMPLETED
  const pendingCuriousScreeningAndAssessments =
    inductionScheduleStatus === InductionScheduleStatusValue.PENDING_INITIAL_SCREENING_AND_ASSESSMENTS_FROM_CURIOUS
  const inductionOnHold =
    !pendingCuriousScreeningAndAssessments &&
    inductionScheduleStatus !== InductionScheduleStatusValue.SCHEDULED &&
    inductionScheduleStatus !== InductionScheduleStatusValue.COMPLETED
  const inductionDueDate = inductionSchedule?.deadlineDate
  const prisonerHasInduction = induction != null

  if (inductionScheduleDoesNotExist || pendingCuriousScreeningAndAssessments) {
    return 'NO_SCHEDULED_INDUCTION'
  }
  if (inductionComplete) {
    return 'COMPLETE'
  }
  if (inductionOnHold) {
    return 'ON_HOLD'
  }
  if (isAfter(today, inductionDueDate)) {
    return prisonerHasInduction ? 'GOALS_OVERDUE' : 'INDUCTION_OVERDUE'
  }
  if (isWithinInterval(inductionDueDate, { start: today, end: addMonths(today, 2) })) {
    return prisonerHasInduction ? 'GOALS_DUE' : 'INDUCTION_DUE'
  }
  return prisonerHasInduction ? 'GOALS_NOT_DUE' : 'INDUCTION_NOT_DUE'
}

const workOutReviewStatus = (
  actionPlanReviews?: ActionPlanReviews,
): 'NOT_DUE' | 'DUE' | 'OVERDUE' | 'NO_SCHEDULED_REVIEW' | 'ON_HOLD' | 'HAS_HAD_LAST_REVIEW' => {
  const today = startOfToday()

  const reviewScheduleDoesNotExist = actionPlanReviews?.latestReviewSchedule == null
  const latestReviewScheduleStatus = actionPlanReviews?.latestReviewSchedule?.status
  const hasHadLastReview = latestReviewScheduleStatus === ActionPlanReviewStatusValue.COMPLETED
  const reviewOnHold =
    latestReviewScheduleStatus !== ActionPlanReviewStatusValue.SCHEDULED &&
    latestReviewScheduleStatus !== ActionPlanReviewStatusValue.COMPLETED
  const reviewDateFrom = actionPlanReviews?.latestReviewSchedule?.reviewDateFrom
  const reviewDueDate = actionPlanReviews?.latestReviewSchedule?.reviewDateTo

  if (reviewScheduleDoesNotExist) {
    return 'NO_SCHEDULED_REVIEW'
  }
  if (hasHadLastReview) {
    return 'HAS_HAD_LAST_REVIEW'
  }
  if (reviewOnHold) {
    return 'ON_HOLD'
  }
  if (isAfter(today, reviewDueDate)) {
    return 'OVERDUE'
  }
  if (isWithinInterval(today, { start: reviewDateFrom, end: reviewDueDate })) {
    return 'DUE'
  }
  return 'NOT_DUE'
}

export { toInductionScheduleView, toActionPlanReviewScheduleView }
