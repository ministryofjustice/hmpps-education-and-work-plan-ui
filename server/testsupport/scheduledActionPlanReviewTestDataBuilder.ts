import type { ScheduledActionPlanReview } from 'viewModels'
import { parseISO, startOfDay } from 'date-fns'
import ActionPlanReviewCalculationRuleValue from '../enums/actionPlanReviewCalculationRuleValue'
import ActionPlanReviewStatusValue from '../enums/actionPlanReviewStatusValue'

const aValidScheduledActionPlanReview = (options?: {
  reference?: string
  reviewDateFrom?: Date
  reviewDateTo?: Date
  calculationRule?: ActionPlanReviewCalculationRuleValue
  status?: ActionPlanReviewStatusValue
  createdAt?: Date
  createdAtPrison?: string
  createdBy?: string
  createdByDisplayName?: string
  updatedAt?: Date
  updatedAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
}): ScheduledActionPlanReview => ({
  reference: options?.reference || '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  reviewDateFrom: options?.reviewDateFrom || startOfDay('2024-09-15'),
  reviewDateTo: options?.reviewDateTo || startOfDay('2024-10-15'),
  calculationRule: options?.calculationRule || ActionPlanReviewCalculationRuleValue.BETWEEN_6_AND_12_MONTHS_TO_SERVE,
  status: options?.status || ActionPlanReviewStatusValue.SCHEDULED,
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44.000Z'),
  createdAtPrison: options?.createdAtPrison || 'Moorland (HMP & YOI)',
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || parseISO('2023-06-19T09:39:44.000Z'),
  updatedAtPrison: options?.updatedAtPrison || 'Moorland (HMP & YOI)',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
})

export default aValidScheduledActionPlanReview
