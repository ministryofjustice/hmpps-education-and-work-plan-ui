import type { EmployabilitySkillResponseDto, EmployabilitySkillsList } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'

const anEmployabilitySkillsList = (options?: {
  prisonNumber?: string
  employabilitySkills?: Array<EmployabilitySkillResponseDto>
}): EmployabilitySkillsList => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  employabilitySkills: options?.employabilitySkills || [anEmployabilitySkillResponseDto()],
})

const anEmployabilitySkillResponseDto = (
  options?: DtoAuditFields & {
    employabilitySkillType?: EmployabilitySkillsValue
    employabilitySkillRating?: EmployabilitySkillRatingValue
    evidence?: string
  },
): EmployabilitySkillResponseDto => ({
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  evidence: options?.evidence || 'Supervisor has reported this',
  activityName: undefined,
  conversationDate: undefined,
  ...validDtoAuditFields(options),
})

export { anEmployabilitySkillResponseDto, anEmployabilitySkillsList }
