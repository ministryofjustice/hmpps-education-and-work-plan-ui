import type { GetEmployabilitySkillResponses, GetEmployabilitySkillsResponse } from 'educationAndWorkPlanApiClient'
import type { EmployabilitySkillResponseDto, EmployabilitySkillsList } from 'dto'
import { startOfDay } from 'date-fns'
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
  activityName: employabilitySkillsResponse.activityName,
  evidence: employabilitySkillsResponse.evidence,
  conversationDate: employabilitySkillsResponse.conversationDate
    ? startOfDay(employabilitySkillsResponse.conversationDate)
    : null,
})

export { toEmployabilitySkillsList, toEmployabilitySkillResponseDto }
