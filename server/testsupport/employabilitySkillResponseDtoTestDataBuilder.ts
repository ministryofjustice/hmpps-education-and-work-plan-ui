import type { EmployabilitySkillResponseDto, EmployabilitySkillsList } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../enums/employabilitySkillSessionType'

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
    sessionType?: EmployabilitySkillSessionType
    sessionTypeDescription?: string
  },
): EmployabilitySkillResponseDto => ({
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  evidence: options?.evidence || 'Supervisor has reported this',
  sessionType: options?.sessionType === null ? null : options?.sessionType || EmployabilitySkillSessionType.CIAG_REVIEW,
  sessionTypeDescription: options?.sessionTypeDescription || null,
  ...validDtoAuditFields(options),
})

export { anEmployabilitySkillResponseDto, anEmployabilitySkillsList }
