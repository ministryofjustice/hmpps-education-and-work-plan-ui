import { format, startOfDay } from 'date-fns'
import type { InductionScheduleResponse } from 'educationAndWorkPlanApiClient'
import InductionScheduleCalculationRuleValue from '../enums/inductionScheduleCalculationRuleValue'
import InductionScheduleStatusValue from '../enums/inductionScheduleStatusValue'

const aValidInductionScheduleResponse = (
  options?: CoreBuilderOptions & {
    deadlineDate?: Date
    scheduleCalculationRule?: InductionScheduleCalculationRuleValue
    scheduleStatus?: InductionScheduleStatusValue
    inductionPerformedBy?: string
    inductionPerformedAt?: Date
  },
): InductionScheduleResponse => ({
  ...baseInductionScheduleResponseTemplate(options),
  deadlineDate: options?.deadlineDate ? format(startOfDay(options.deadlineDate), 'yyyy-MM-dd') : '2024-12-10',
  scheduleCalculationRule:
    options?.scheduleCalculationRule || InductionScheduleCalculationRuleValue.NEW_PRISON_ADMISSION,
  scheduleStatus: options?.scheduleStatus || InductionScheduleStatusValue.SCHEDULED,
  inductionPerformedBy: options?.inductionPerformedBy,
  inductionPerformedAt: options?.inductionPerformedAt
    ? format(startOfDay(options.inductionPerformedAt), 'yyyy-MM-dd')
    : undefined,
})

type CoreBuilderOptions = {
  prisonNumber?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}

const baseInductionScheduleResponseTemplate = (options?: CoreBuilderOptions): InductionScheduleResponse => ({
  reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  ...auditFields(options),
  deadlineDate: undefined,
  scheduleCalculationRule: undefined,
  scheduleStatus: undefined,
  inductionPerformedBy: undefined,
  inductionPerformedAt: undefined,
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
  createdAtPrison: options?.createdAtPrison || 'BXI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || '2023-06-19T09:39:44Z',
  updatedAtPrison: options?.updatedAtPrison || 'BXI',
})

export default aValidInductionScheduleResponse
