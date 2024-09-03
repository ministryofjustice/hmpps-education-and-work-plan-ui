import type { EducationResponse } from 'educationAndWorkPlanApiClient'
import type { EducationDto } from 'inductionDto'

function toCreateEducationRequest(educationDto: EducationDto): EducationResponse {
  return { ...educationDto }
}

export default toCreateEducationRequest
