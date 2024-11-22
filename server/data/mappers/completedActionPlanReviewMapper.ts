import { parseISO, startOfDay } from 'date-fns'
import type { CompletedActionPlanReview } from 'viewModels'
import type { CompletedActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import toNote from './noteMapper'

const toCompletedActionPlanReview = (
  completedActionPlanReviewResponse: CompletedActionPlanReviewResponse,
  prisonNamesById: Map<string, string>,
): CompletedActionPlanReview => ({
  reference: completedActionPlanReviewResponse.reference,
  deadlineDate: startOfDay(parseISO(completedActionPlanReviewResponse.deadlineDate)),
  completedDate: startOfDay(parseISO(completedActionPlanReviewResponse.completedDate)),
  note: toNote(completedActionPlanReviewResponse.note, prisonNamesById),
  conductedBy: completedActionPlanReviewResponse.conductedBy,
  conductedByRole: completedActionPlanReviewResponse.conductedByRole,
  createdBy: completedActionPlanReviewResponse.createdBy,
  createdByDisplayName: completedActionPlanReviewResponse.createdByDisplayName,
  createdAt: parseISO(completedActionPlanReviewResponse.createdAt),
  createdAtPrison:
    prisonNamesById.get(completedActionPlanReviewResponse.createdAtPrison) ||
    completedActionPlanReviewResponse.createdAtPrison,
})

export default toCompletedActionPlanReview
