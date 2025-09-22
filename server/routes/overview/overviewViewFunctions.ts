import type { ActionPlanReviews, InductionSchedule, ScheduledActionPlanReview } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import { addMonths, isAfter, isWithinInterval, startOfToday, subMonths } from 'date-fns'
import type { ActionPlanReviewScheduleView, InductionScheduleView } from './overviewViewTypes'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'

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
  const inductionComplete = inductionScheduleStatus === InductionScheduleStatusValue.COMPLETED
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
  const reviewDateFrom = // TODO - RR-1919 - revert to this: actionPlanReviews?.latestReviewSchedule?.reviewDateFrom
    actionPlanReviews?.latestReviewSchedule != null
      ? adjustReviewDateFrom(actionPlanReviews.latestReviewSchedule)
      : null
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

// TODO - temp fix for RR-1919 - the ScheduledActionPlanReview.reviewDateFrom value _might_ be wrong in some cases
// Until a data fix is implemented at the API, the safest option is to recalculate the reviewDateFrom value by subtracting the relevant number of months
// from the reviewDueDate value (ie reverse-engineer what the API ReviewScheduleDateCalculationService.calculateReviewWindow would have done)
const adjustReviewDateFrom = (latestReviewSchedule: ScheduledActionPlanReview): Date => {
  if (
    [
      ActionPlanReviewCalculationRuleValue.BETWEEN_6_AND_12_MONTHS_TO_SERVE,
      ActionPlanReviewCalculationRuleValue.PRISONER_ON_REMAND,
      ActionPlanReviewCalculationRuleValue.PRISONER_UN_SENTENCED,
    ].includes(latestReviewSchedule.calculationRule)
  ) {
    return subMonths(latestReviewSchedule.reviewDateTo, 1)
  }
  if (
    [
      ActionPlanReviewCalculationRuleValue.BETWEEN_3_MONTHS_8_DAYS_AND_6_MONTHS_TO_SERVE,
      ActionPlanReviewCalculationRuleValue.BETWEEN_12_AND_60_MONTHS_TO_SERVE,
      ActionPlanReviewCalculationRuleValue.MORE_THAN_60_MONTHS_TO_SERVE,
      ActionPlanReviewCalculationRuleValue.INDETERMINATE_SENTENCE,
    ].includes(latestReviewSchedule.calculationRule)
  ) {
    return subMonths(latestReviewSchedule.reviewDateTo, 2)
  }
  return latestReviewSchedule.reviewDateFrom
}

export { toInductionScheduleView, toActionPlanReviewScheduleView }
