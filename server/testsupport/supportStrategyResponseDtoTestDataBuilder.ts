import type { SupportStrategyResponseDto } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import SupportStrategyType from '../enums/supportStrategyType'
import SupportStrategyCategory from '../enums/supportStrategyCategory'

const aValidSupportStrategyResponseDto = (
  options?: DtoAuditFields & {
    supportStrategyCategoryTypeCode?: SupportStrategyType
    supportStrategyCategory?: SupportStrategyCategory
    details?: string
    active?: boolean
  },
): SupportStrategyResponseDto => ({
  supportStrategyTypeCode: options?.supportStrategyCategoryTypeCode || SupportStrategyType.MEMORY,
  supportStrategyCategory: options?.supportStrategyCategory || SupportStrategyCategory.LITERACY_SKILLS,
  supportStrategyDetails:
    options?.details === null ? null : options?.details || 'John can read and understand written language very well',
  active: options?.active == null ? true : options?.active,
  ...validDtoAuditFields(options),
})

export default aValidSupportStrategyResponseDto
