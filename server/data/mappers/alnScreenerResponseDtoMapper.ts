import { parseISO } from 'date-fns'
import type { AlnScreenerList, AlnScreenerResponseDto } from 'dto'
import type { ALNScreenerResponse, ALNScreeners } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'
import { toStrengthResponseDto } from './strengthResponseDtoMapper'
import { toChallengeResponseDto } from './challengeDtoMapper'

const toAlnScreenerList = (alnScreeners: ALNScreeners, prisonNumber: string): AlnScreenerList => ({
  prisonNumber,
  screeners: alnScreeners?.screeners.map(toAlnScreenerResponseDto) || [],
})

const toAlnScreenerResponseDto = (alnScreenerResponse: ALNScreenerResponse): AlnScreenerResponseDto => ({
  ...toReferenceAndAuditable(alnScreenerResponse),
  screenerDate: parseISO(alnScreenerResponse.screenerDate),
  challenges: alnScreenerResponse.challenges.map(toChallengeResponseDto),
  strengths: alnScreenerResponse.strengths.map(toStrengthResponseDto),
})

export { toAlnScreenerList, toAlnScreenerResponseDto }
