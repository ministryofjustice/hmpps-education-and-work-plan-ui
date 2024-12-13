import type { UpdateReviewScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import type { ReviewExemptionDto } from 'dto'

const toUpdateReviewScheduleStatusRequest = (dto: ReviewExemptionDto): UpdateReviewScheduleStatusRequest => ({
  prisonId: dto.prisonId,
  status: dto.exemptionReason,
  exemptionReason: dto.exemptionReasonDetails,
})

export default toUpdateReviewScheduleStatusRequest
