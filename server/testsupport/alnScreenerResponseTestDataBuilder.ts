import type {
  ALNScreenerResponse,
  ALNScreeners,
  ChallengeResponse,
  StrengthResponse,
} from 'supportAdditionalNeedsApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import { aValidChallengeResponse } from './challengeResponseTestDataBuilder'
import { aValidStrengthResponse } from './strengthResponseTestDataBuilder'

const aValidAlnScreeners = (options?: { screeners?: Array<ALNScreenerResponse> }): ALNScreeners => ({
  screeners: options?.screeners || [aValidAlnScreenerResponse()],
})

const aValidAlnScreenerResponse = (
  options?: AuditFields & {
    screenerDate?: string
    challenges?: Array<ChallengeResponse>
    strengths?: Array<StrengthResponse>
  },
): ALNScreenerResponse => ({
  screenerDate: options?.screenerDate === null ? null : options?.screenerDate || '2025-06-18',
  challenges: options?.challenges || [aValidChallengeResponse()],
  strengths: options?.strengths || [aValidStrengthResponse()],
  ...validAuditFields(options),
})

export { aValidAlnScreeners, aValidAlnScreenerResponse }
