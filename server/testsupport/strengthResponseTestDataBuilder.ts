import type { StrengthListResponse, StrengthResponse } from 'supportAdditionalNeedsApiClient'
import { validAuditFields, AuditFields } from './auditFieldsTestDataBuilder'

const aValidStrengthListResponse = (options?: { strengths?: Array<StrengthResponse> }): StrengthListResponse => ({
  strengths: options?.strengths || [aValidStrengthResponse()],
})

const aValidStrengthResponse = (
  options?: AuditFields & {
    active?: boolean
    fromALNScreener?: boolean
    strengthTypeCode?: string
    strengthCategory?: string
    symptoms?: string
    howIdentified?: Array<string>
    howIdentifiedOther?: string
    alnScreenerDate?: string
  },
): StrengthResponse => ({
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || ['CONVERSATIONS'],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
  strengthType: {
    code: options?.strengthTypeCode || 'READING_COMPREHENSION',
    categoryCode: options?.strengthCategory || 'LITERACY_SKILLS',
  },
  alnScreenerDate: options?.alnScreenerDate === null ? null : options?.alnScreenerDate || '2025-06-18',
  ...validAuditFields(options),
})

export { aValidStrengthResponse, aValidStrengthListResponse }
