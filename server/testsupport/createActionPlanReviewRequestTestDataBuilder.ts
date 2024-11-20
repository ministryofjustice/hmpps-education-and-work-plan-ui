import type { CreateActionPlanReviewRequest } from 'educationAndWorkPlanApiClient'
import { format, startOfDay } from 'date-fns'

const aValidCreateActionPlanReviewRequest = (options?: {
  prisonId?: string
  note?: string
  conductedAt?: Date
  conductedBy?: string
  conductedByRole?: string
}): CreateActionPlanReviewRequest => {
  const createActionPlanReviewRequest: CreateActionPlanReviewRequest = {
    prisonId: options?.prisonId || 'BXI',
    note: options?.note || 'Review went well and goals on target for completion',
    conductedAt: options?.conductedAt ? format(startOfDay(options.conductedAt), 'yyyy-MM-dd') : '2024-10-01',
  }
  if (options?.conductedBy) {
    createActionPlanReviewRequest.conductedBy = options?.conductedBy
  }
  if (options?.conductedByRole) {
    createActionPlanReviewRequest.conductedByRole = options?.conductedByRole
  }
  return createActionPlanReviewRequest
}

export default aValidCreateActionPlanReviewRequest
