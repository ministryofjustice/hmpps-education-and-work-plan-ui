import type { GetEmployabilitySkillResponses, GetEmployabilitySkillsResponse } from 'educationAndWorkPlanApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'

const aGetEmployabilitySkillResponses = (options?: {
  employabilitySkills?: Array<GetEmployabilitySkillsResponse>
}): GetEmployabilitySkillResponses => ({
  employabilitySkills: options?.employabilitySkills || [aGetEmployabilitySkillsResponse()],
})

const aGetEmployabilitySkillsResponse = (
  options?: AuditFields & {
    employabilitySkillType?: EmployabilitySkillsValue
    employabilitySkillRating?: EmployabilitySkillRatingValue
    activityName?: string
    evidence?: string
    conversationDate?: string
  },
): GetEmployabilitySkillsResponse => ({
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  activityName: options?.activityName || 'E Wing Servery',
  evidence: options?.evidence || 'Supervisor has reported this',
  conversationDate: options?.conversationDate === null ? null : options?.conversationDate || '2026-01-26',
  ...validAuditFields(options),
})

export { aGetEmployabilitySkillResponses, aGetEmployabilitySkillsResponse }
