import { format, startOfDay } from 'date-fns'
import type { ScheduledActionPlanReviewResponse } from 'educationAndWorkPlanApiClient'
import ActionPlanReviewStatusValue from '../enums/actionPlanReviewStatusValue'
import ActionPlanReviewCalculationRuleValue from '../enums/actionPlanReviewCalculationRuleValue'

const aValidScheduledActionPlanReviewResponse = (
  options?: CoreBuilderOptions & {
    reviewDateFrom?: Date
    reviewDateTo?: Date
    calculationRule?: ActionPlanReviewCalculationRuleValue
    status?: ActionPlanReviewStatusValue
  },
): ScheduledActionPlanReviewResponse => ({
  ...baseActionPlanReviewsResponseTemplate(options),
  reviewDateFrom: options?.reviewDateFrom ? format(startOfDay(options.reviewDateFrom), 'yyyy-MM-dd') : '2024-09-15',
  reviewDateTo: options?.reviewDateFrom ? format(startOfDay(options.reviewDateTo), 'yyyy-MM-dd') : '2024-10-15',
  calculationRule: options?.calculationRule || ActionPlanReviewCalculationRuleValue.BETWEEN_6_AND_12_MONTHS_TO_SERVE,
  status: options?.status || ActionPlanReviewStatusValue.SCHEDULED,
})

type CoreBuilderOptions = {
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}

const baseActionPlanReviewsResponseTemplate = (options?: CoreBuilderOptions): ScheduledActionPlanReviewResponse => ({
  reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  ...auditFields(options),
  reviewDateFrom: undefined,
  reviewDateTo: undefined,
  calculationRule: undefined,
  status: undefined,
})

const auditFields = (
  options?: CoreBuilderOptions,
): {
  createdBy: string
  createdByDisplayName: string
  createdAt: string
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: string
  updatedAtPrison: string
} => ({
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || '2023-06-19T09:39:44Z',
  createdAtPrison: options?.createdAtPrison || 'MDI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
  updatedAtPrison: options?.updatedAtPrison || 'MDI',
})

export default aValidScheduledActionPlanReviewResponse
