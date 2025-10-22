import { startOfToday, subDays } from 'date-fns'
import type { AlnScreenerList, AlnScreenerResponseDto, ChallengeResponseDto, StrengthResponseDto } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import { aValidStrengthResponseDto } from './strengthResponseDtoTestDataBuilder'
import aValidChallengeResponseDto from './challengeResponseDtoTestDataBuilder'

const aValidAlnScreenerList = (options?: {
  prisonNumber?: string
  screeners?: Array<AlnScreenerResponseDto>
}): AlnScreenerList => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  screeners: options?.screeners || [aValidAlnScreenerResponseDto()],
})

const aValidAlnScreenerResponseDto = (
  options?: DtoAuditFields & {
    screenerDate?: Date
    challenges?: Array<ChallengeResponseDto>
    strengths?: Array<StrengthResponseDto>
  },
): AlnScreenerResponseDto => ({
  screenerDate: options?.screenerDate || subDays(startOfToday(), 1),
  challenges: options?.challenges || [aValidChallengeResponseDto()],
  strengths: options?.strengths || [aValidStrengthResponseDto()],
  ...validDtoAuditFields(options),
})

export { aValidAlnScreenerList, aValidAlnScreenerResponseDto }
