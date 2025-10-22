import type { StrengthResponseDto, StrengthsList } from 'dto'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'
import StrengthType from '../enums/strengthType'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import StrengthCategory from '../enums/strengthCategory'

const aValidStrengthsList = (options?: {
  prisonNumber?: string
  strengths?: Array<StrengthResponseDto>
}): StrengthsList => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  strengths: options?.strengths || [aValidStrengthResponseDto()],
})

const aValidStrengthResponseDto = (
  options?: DtoAuditFields & {
    strengthTypeCode?: StrengthType
    strengthCategory?: StrengthCategory
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
    active?: boolean
    fromALNScreener?: boolean
    alnScreenerDate?: Date
  },
): StrengthResponseDto => ({
  strengthTypeCode: options?.strengthTypeCode || StrengthType.READING_COMPREHENSION,
  strengthCategory: options?.strengthCategory || StrengthCategory.LITERACY_SKILLS,
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [StrengthIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  alnScreenerDate: options?.alnScreenerDate === null ? null : options?.alnScreenerDate,
  ...validDtoAuditFields(options),
})

export { aValidStrengthResponseDto, aValidStrengthsList }
