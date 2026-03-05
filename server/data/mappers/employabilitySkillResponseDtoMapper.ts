import type { GetEmployabilitySkillResponses, GetEmployabilitySkillsResponse } from 'educationAndWorkPlanApiClient'
import type { EmployabilitySkillResponseDto, EmployabilitySkillsList } from 'dto'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toEmployabilitySkillsList = (
  apiResponse: GetEmployabilitySkillResponses,
  prisonNumber: string,
): EmployabilitySkillsList => ({
  prisonNumber,
  employabilitySkills: apiResponse?.employabilitySkills.map(toEmployabilitySkillResponseDto) || [],
})

const toEmployabilitySkillResponseDto = (
  employabilitySkillsResponse: GetEmployabilitySkillsResponse,
): EmployabilitySkillResponseDto => ({
  ...toReferenceAndAuditable(employabilitySkillsResponse),
  employabilitySkillType: employabilitySkillsResponse.employabilitySkillType,
  employabilitySkillRating: employabilitySkillsResponse.employabilitySkillRating,
  evidence: employabilitySkillsResponse.evidence,
  sessionType: employabilitySkillsResponse.sessionType,
  sessionTypeDescription: employabilitySkillsResponse.sessionTypeDescription,
})

export { toEmployabilitySkillsList, toEmployabilitySkillResponseDto }
