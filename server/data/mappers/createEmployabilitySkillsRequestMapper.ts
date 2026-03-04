import type { CreateEmployabilitySkillsRequest } from 'educationAndWorkPlanApiClient'
import type { CreateEmployabilitySkillDto } from 'dto'

const toCreateEmployabilitySkillsRequest = (
  employabilitySkillDtos: Array<CreateEmployabilitySkillDto>,
): CreateEmployabilitySkillsRequest => ({
  employabilitySkills: (employabilitySkillDtos || []).map(employabilitySkillDto => ({
    prisonId: employabilitySkillDto.prisonId,
    employabilitySkillType: employabilitySkillDto.employabilitySkillType,
    employabilitySkillRating: employabilitySkillDto.employabilitySkillRating,
    evidence: employabilitySkillDto.evidence,
    sessionType: null as string, // TODO - update the mapping of these 2 fields once the DTO has been updated with corresponding fields
    sessionTypeDescription: null as string,
  })),
})
export default toCreateEmployabilitySkillsRequest
