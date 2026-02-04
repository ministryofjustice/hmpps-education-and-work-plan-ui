import { startOfDay } from 'date-fns'
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
    activityName?: string
    evidence?: string
    conversationDate?: Date
  },
): EmployabilitySkillResponseDto => ({
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  activityName: options?.activityName || 'E Wing Servery',
  evidence: options?.evidence || 'Supervisor has reported this',
  conversationDate: options?.conversationDate === null ? null : options?.conversationDate || startOfDay('2026-01-26'),
  ...validDtoAuditFields(options),
})

export { anEmployabilitySkillResponseDto, anEmployabilitySkillsList }
