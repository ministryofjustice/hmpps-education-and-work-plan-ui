import type { CreateEmployabilitySkillsRequest } from 'educationAndWorkPlanApiClient'
import type { CreateEmployabilitySkillDto } from 'dto'
import { format } from 'date-fns'

const toCreateEmployabilitySkillsRequest = (
  employabilitySkillDtos: Array<CreateEmployabilitySkillDto>,
): CreateEmployabilitySkillsRequest => ({
  employabilitySkills: (employabilitySkillDtos || []).map(employabilitySkillDto => ({
    prisonId: employabilitySkillDto.prisonId,
    employabilitySkillType: employabilitySkillDto.employabilitySkillType,
    employabilitySkillRating: employabilitySkillDto.employabilitySkillRating,
    activityName: employabilitySkillDto.activityName,
    evidence: employabilitySkillDto.evidence,
    conversationDate: employabilitySkillDto.conversationDate
      ? format(employabilitySkillDto.conversationDate, 'yyyy-MM-dd')
      : null,
  })),
})
export default toCreateEmployabilitySkillsRequest
