import { parseISO, startOfDay } from 'date-fns'
import type { ScheduledActionPlanReview } from 'viewModels'
import type { ScheduledActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import ActionPlanReviewStatusValue from '../../enums/actionPlanReviewStatusValue'
import ActionPlanReviewCalculationRuleValue from '../../enums/actionPlanReviewCalculationRuleValue'

const toScheduledActionPlanReview = (
  scheduledActionPlanReviewResponse: ScheduledActionPlanReviewResponse,
  prisonNamesById: Record<string, string>,
): ScheduledActionPlanReview => ({
  reference: scheduledActionPlanReviewResponse.reference,
  reviewDateFrom: startOfDay(parseISO(scheduledActionPlanReviewResponse.reviewDateFrom)),
  reviewDateTo: startOfDay(parseISO(scheduledActionPlanReviewResponse.reviewDateTo)),
  status: scheduledActionPlanReviewResponse.status as ActionPlanReviewStatusValue,
  calculationRule: scheduledActionPlanReviewResponse.calculationRule as ActionPlanReviewCalculationRuleValue,
  createdBy: scheduledActionPlanReviewResponse.createdBy,
  createdByDisplayName: scheduledActionPlanReviewResponse.createdByDisplayName,
  createdAt: parseISO(scheduledActionPlanReviewResponse.createdAt),
  createdAtPrison:
    prisonNamesById[scheduledActionPlanReviewResponse.createdAtPrison] ||
    scheduledActionPlanReviewResponse.createdAtPrison,
  updatedBy: scheduledActionPlanReviewResponse.updatedBy,
  updatedByDisplayName: scheduledActionPlanReviewResponse.updatedByDisplayName,
  updatedAt: parseISO(scheduledActionPlanReviewResponse.updatedAt),
  updatedAtPrison:
    prisonNamesById[scheduledActionPlanReviewResponse.updatedAtPrison] ||
    scheduledActionPlanReviewResponse.updatedAtPrison,
})

export default toScheduledActionPlanReview
