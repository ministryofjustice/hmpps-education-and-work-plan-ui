import type { GetEmployabilitySkillResponses, GetEmployabilitySkillsResponse } from 'educationAndWorkPlanApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../enums/employabilitySkillSessionType'

const aGetEmployabilitySkillResponses = (options?: {
  employabilitySkills?: Array<GetEmployabilitySkillsResponse>
}): GetEmployabilitySkillResponses => ({
  employabilitySkills: options?.employabilitySkills || [aGetEmployabilitySkillsResponse()],
})

const aGetEmployabilitySkillsResponse = (
  options?: AuditFields & {
    employabilitySkillType?: EmployabilitySkillsValue
    employabilitySkillRating?: EmployabilitySkillRatingValue
    evidence?: string
    sessionType?: EmployabilitySkillSessionType
    sessionTypeDescription?: string
  },
): GetEmployabilitySkillsResponse => ({
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  evidence: options?.evidence || 'Supervisor has reported this',
  sessionType: options?.sessionType === null ? null : options?.sessionType || EmployabilitySkillSessionType.CIAG_REVIEW,
  sessionTypeDescription: options?.sessionTypeDescription || null,
  ...validAuditFields(options),
})

export { aGetEmployabilitySkillResponses, aGetEmployabilitySkillsResponse }
