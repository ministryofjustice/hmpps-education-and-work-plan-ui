import { format, startOfToday, subMonths } from 'date-fns'
import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

const aValidChallengeListResponse = (options?: {
  challengeResponses?: Array<ChallengeResponse>
}): ChallengeListResponse => ({
  challenges: options?.challengeResponses || [aValidChallengeResponse()],
})

const aValidChallengeResponse = (
  options?: AuditFields & {
    active?: boolean
    fromALNScreener?: boolean
    screeningDate?: Date
    challengeTypeCode?: string
    symptoms?: string
    howIdentified?: Array<ChallengeIdentificationSource>
    howIdentifiedOther?: string
    alnScreenerDate?: string
    challengeCategory?: string
  },
): ChallengeResponse => ({
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  screeningDate:
    options?.screeningDate === null
      ? null
      : format(options?.screeningDate || subMonths(startOfToday(), 1), 'yyyy-MM-dd'),
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified:
    options?.howIdentified === null ? null : options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || 'John was seen to have other challenges',
  challengeType: {
    code: options?.challengeTypeCode || 'READING_COMPREHENSION',
    categoryCode: options?.challengeCategory || 'LITERACY_SKILLS',
  },
  alnScreenerDate: options?.alnScreenerDate === null ? null : options?.alnScreenerDate || '2025-06-18',
  ...validAuditFields(options),
})

export { aValidChallengeResponse, aValidChallengeListResponse }
