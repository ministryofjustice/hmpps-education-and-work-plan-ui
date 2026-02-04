import { startOfDay } from 'date-fns'
import type { CreateEmployabilitySkillDto } from 'dto'
import EmployabilitySkillsValue from '../enums/employabilitySkillsValue'
import EmployabilitySkillRatingValue from '../enums/employabilitySkillRatingValue'

const aCreateEmployabilitySkillDto = (options?: {
  prisonId?: string
  employabilitySkillType?: EmployabilitySkillsValue
  employabilitySkillRating?: EmployabilitySkillRatingValue
  activityName?: string
  evidence?: string
  conversationDate?: Date
}): CreateEmployabilitySkillDto => ({
  prisonId: options?.prisonId || 'BXI',
  employabilitySkillType: options?.employabilitySkillType || EmployabilitySkillsValue.ORGANISATION,
  employabilitySkillRating: options?.employabilitySkillRating || EmployabilitySkillRatingValue.QUITE_CONFIDENT,
  activityName: options?.activityName || 'E Wing Servery',
  evidence: options?.evidence || 'Supervisor has reported this',
  conversationDate: options?.conversationDate === null ? null : options?.conversationDate || startOfDay('2026-01-26'),
})

export default aCreateEmployabilitySkillDto
