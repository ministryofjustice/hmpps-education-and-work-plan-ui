import type { EducationResponse } from 'educationAndWorkPlanApiClient'
import type { EducationDto } from 'inductionDto'

function toEducationResponse(educationDto: EducationDto): EducationResponse {
  return { ...educationDto }
}

export default toEducationResponse
