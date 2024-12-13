import type { UpdateReviewScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import ReviewScheduleStatusValue from '../enums/reviewScheduleStatusValue'

const aValidUpdateReviewScheduleStatusRequest = (options?: {
  prisonId?: string
  status?: ReviewScheduleStatusValue
  exemptionReason?: string
}): UpdateReviewScheduleStatusRequest => ({
  prisonId: options?.prisonId || 'BXI',
  status: (options?.status || ReviewScheduleStatusValue.EXEMPT_PRISON_REGIME_CIRCUMSTANCES).toString(),
  exemptionReason: options?.exemptionReason,
})

export default aValidUpdateReviewScheduleStatusRequest
