import { parseISO, startOfDay } from 'date-fns'
import type { InductionScheduleResponse } from 'educationAndWorkPlanApiClient'
import type { InductionSchedule } from 'viewModels'
import InductionScheduleCalculationRuleValue from '../../enums/inductionScheduleCalculationRuleValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

const toInductionSchedule = (inductionScheduleResponse: InductionScheduleResponse): InductionSchedule => ({
  prisonNumber: inductionScheduleResponse.prisonNumber,
  deadlineDate: startOfDay(parseISO(inductionScheduleResponse.deadlineDate)),
  scheduleCalculationRule: inductionScheduleResponse.scheduleCalculationRule as InductionScheduleCalculationRuleValue,
  scheduleStatus: inductionScheduleResponse.scheduleStatus as InductionScheduleStatusValue,
  inductionPerformedBy: inductionScheduleResponse.inductionPerformedBy,
  inductionPerformedAt: inductionScheduleResponse.inductionPerformedAt,
  reference: inductionScheduleResponse.reference,
  createdBy: inductionScheduleResponse.createdBy,
  createdByDisplayName: inductionScheduleResponse.createdByDisplayName,
  createdAt: parseISO(inductionScheduleResponse.createdAt),
  updatedBy: inductionScheduleResponse.updatedBy,
  updatedByDisplayName: inductionScheduleResponse.updatedByDisplayName,
  updatedAt: parseISO(inductionScheduleResponse.updatedAt),
  problemRetrievingData: false,
})

export default toInductionSchedule
