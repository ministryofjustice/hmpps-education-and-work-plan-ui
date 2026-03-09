import type { CreateInductionRequest } from 'educationAndWorkPlanApiClient'
import type { CreateOrUpdateInductionDto } from 'inductionDto'

function toCreateInductionRequest(createInductionDto: CreateOrUpdateInductionDto): CreateInductionRequest {
  return {
    ...createInductionDto,
    employabilitySkills: createInductionDto.employabilitySkills
      ? { employabilitySkills: createInductionDto.employabilitySkills }
      : undefined,
  }
}

export default toCreateInductionRequest
