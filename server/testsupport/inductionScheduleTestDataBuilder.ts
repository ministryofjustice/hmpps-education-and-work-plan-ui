import { parseISO, startOfDay } from 'date-fns'
import type { InductionSchedule } from 'viewModels'
import InductionScheduleCalculationRuleValue from '../enums/inductionScheduleCalculationRuleValue'
import InductionScheduleStatusValue from '../enums/inductionScheduleStatusValue'

const aValidInductionSchedule = (
  options?: CoreBuilderOptions & {
    deadlineDate?: Date
    scheduleCalculationRule?: InductionScheduleCalculationRuleValue
    scheduleStatus?: InductionScheduleStatusValue
    inductionPerformedBy?: string
    inductionPerformedAt?: Date
  },
): InductionSchedule => ({
  ...baseInductionScheduleTemplate(options),
  deadlineDate: options?.deadlineDate || startOfDay('2024-12-10'),
  scheduleCalculationRule:
    options?.scheduleCalculationRule || InductionScheduleCalculationRuleValue.NEW_PRISON_ADMISSION,
  scheduleStatus: options?.scheduleStatus || InductionScheduleStatusValue.SCHEDULED,
  inductionPerformedBy: options?.inductionPerformedBy,
  inductionPerformedAt: options?.inductionPerformedAt ? startOfDay(options.inductionPerformedAt) : undefined,
  problemRetrievingData: false,
})

type CoreBuilderOptions = {
  prisonNumber?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: Date
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: Date
  updatedAtPrison?: string
}

const baseInductionScheduleTemplate = (options?: CoreBuilderOptions): InductionSchedule => ({
  reference: '814ade0a-a3b2-46a3-862f-79211ba13f7b',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  ...auditFields(options),
  deadlineDate: undefined,
  scheduleCalculationRule: undefined,
  scheduleStatus: undefined,
  inductionPerformedBy: undefined,
  inductionPerformedAt: undefined,
  problemRetrievingData: undefined,
})

const auditFields = (
  options?: CoreBuilderOptions,
): {
  createdBy: string
  createdByDisplayName: string
  createdAt: Date
  createdAtPrison: string
  updatedBy: string
  updatedByDisplayName: string
  updatedAt: Date
  updatedAtPrison: string
} => ({
  createdBy: options?.createdBy || 'asmith_gen',
  createdByDisplayName: options?.createdByDisplayName || 'Alex Smith',
  createdAt: options?.createdAt || parseISO('2023-06-19T09:39:44Z'),
  createdAtPrison: options?.createdAtPrison || 'BXI',
  updatedBy: options?.updatedBy || 'asmith_gen',
  updatedByDisplayName: options?.updatedByDisplayName || 'Alex Smith',
  updatedAt: options?.updatedAt || parseISO('2023-06-19T09:39:44Z'),
  updatedAtPrison: options?.updatedAtPrison || 'BXI',
})

export default aValidInductionSchedule
