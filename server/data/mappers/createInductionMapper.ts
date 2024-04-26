import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'inductionDto'

function toCreateInductionRequest(createInductionDto: CreateOrUpdateInductionDto): CreateInductionRequest {
  return { ...createInductionDto }
}

export default toCreateInductionRequest
