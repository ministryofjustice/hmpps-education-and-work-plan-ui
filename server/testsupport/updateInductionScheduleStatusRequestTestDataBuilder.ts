import type { UpdateInductionScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import InductionScheduleStatusValue from '../enums/inductionScheduleStatusValue'

const aValidUpdateInductionScheduleStatusRequest = (options?: {
  prisonId?: string
  status?: InductionScheduleStatusValue
  exemptionReason?: string
}): UpdateInductionScheduleStatusRequest => ({
  prisonId: options?.prisonId || 'BXI',
  status: (options?.status || InductionScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES).toString(),
  exemptionReason: options?.exemptionReason,
})

export default aValidUpdateInductionScheduleStatusRequest
