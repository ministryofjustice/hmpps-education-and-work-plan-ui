import type { UpdateInductionScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import type { InductionExemptionDto } from 'inductionDto'

const toUpdateInductionScheduleStatusRequest = (dto: InductionExemptionDto): UpdateInductionScheduleStatusRequest => ({
  prisonId: dto.prisonId,
  status: dto.exemptionReason,
  exemptionReason: dto.exemptionReasonDetails,
})

export default toUpdateInductionScheduleStatusRequest
