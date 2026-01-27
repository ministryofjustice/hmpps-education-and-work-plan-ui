import { parseISO, startOfDay } from 'date-fns'
import type { ScheduledActionPlanReview } from 'viewModels'
import type { ScheduledActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'

const toScheduledActionPlanReview = (
  scheduledActionPlanReviewResponse: ScheduledActionPlanReviewResponse,
  prisonNamesById: Record<string, string>,
): ScheduledActionPlanReview => ({
  reference: scheduledActionPlanReviewResponse.reference,
  reviewDateFrom: startOfDay(parseISO(scheduledActionPlanReviewResponse.reviewDateFrom)),
  reviewDateTo: startOfDay(parseISO(scheduledActionPlanReviewResponse.reviewDateTo)),
  status: scheduledActionPlanReviewResponse.status,
  calculationRule: scheduledActionPlanReviewResponse.calculationRule,
  reviewType: scheduledActionPlanReviewResponse.reviewType,
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
