import type { UpdateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'inductionDto'

function toUpdateInductionRequest(updateInductionDto: CreateOrUpdateInductionDto): UpdateInductionRequest {
  return { ...updateInductionDto }
}

export default toUpdateInductionRequest
