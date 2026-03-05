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
    sessionType: employabilitySkillDto.sessionType,
    sessionTypeDescription: employabilitySkillDto.sessionTypeDescription,
  })),
})
export default toCreateEmployabilitySkillsRequest
