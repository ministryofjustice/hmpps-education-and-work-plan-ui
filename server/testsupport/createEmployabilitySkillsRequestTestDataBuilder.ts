import type { CreateEmployabilitySkillRequest, CreateEmployabilitySkillsRequest } from 'educationAndWorkPlanApiClient'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'

const aCreateEmployabilitySkillsRequest = (options?: {
  employabilitySkills?: Array<CreateEmployabilitySkillRequest>
}): CreateEmployabilitySkillsRequest => ({
  employabilitySkills: options?.employabilitySkills || [aCreateEmployabilitySkillRequest()],
})

const aCreateEmployabilitySkillRequest = (options?: {
  prisonId?: string
  employabilitySkillType?: EmployabilitySkillsValue
  employabilitySkillRating?: EmployabilitySkillRatingValue
  activityName?: string
  evidence?: string
  conversationDate?: string
}): CreateEmployabilitySkillRequest => ({
  prisonId: options?.prisonId || 'BXI',
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  activityName: options?.activityName || 'E Wing Servery',
  evidence: options?.evidence || 'Supervisor has reported this',
  conversationDate: options?.conversationDate === null ? null : options?.conversationDate || '2026-01-26',
})

export { aCreateEmployabilitySkillsRequest, aCreateEmployabilitySkillRequest }
