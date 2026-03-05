import type { CreateEmployabilitySkillDto } from 'dto'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../enums/employabilitySkillSessionType'

const aCreateEmployabilitySkillDto = (options?: {
  prisonId?: string
  employabilitySkillType?: EmployabilitySkillsValue
  employabilitySkillRating?: EmployabilitySkillRatingValue
  evidence?: string
  sessionType?: EmployabilitySkillSessionType
  sessionTypeDescription?: string
}): CreateEmployabilitySkillDto => ({
  prisonId: options?.prisonId || 'BXI',
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  evidence: options?.evidence || 'Supervisor has reported this',
  sessionType: options?.sessionType === null ? null : options?.sessionType || EmployabilitySkillSessionType.CIAG_REVIEW,
  sessionTypeDescription: options?.sessionTypeDescription || null,
})

export default aCreateEmployabilitySkillDto
