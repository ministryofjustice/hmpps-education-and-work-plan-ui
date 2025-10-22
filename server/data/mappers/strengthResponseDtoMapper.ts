import { parseISO } from 'date-fns'
import type { StrengthResponseDto, StrengthsList } from 'dto'
import type { StrengthListResponse, StrengthResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toStrengthsList = (strengthListResponse: StrengthListResponse, prisonNumber: string): StrengthsList => ({
  prisonNumber,
  strengths: strengthListResponse?.strengths.map(toStrengthResponseDto) || [],
})

const toStrengthResponseDto = (strengthResponse: StrengthResponse): StrengthResponseDto => ({
  ...toReferenceAndAuditable(strengthResponse),
  strengthTypeCode: strengthResponse.strengthType.code,
  strengthCategory: strengthResponse.strengthType.categoryCode,
  symptoms: strengthResponse.symptoms,
  howIdentified: strengthResponse.howIdentified,
  howIdentifiedOther: strengthResponse.howIdentifiedOther,
  active: strengthResponse.active,
  fromALNScreener: strengthResponse.fromALNScreener,
  alnScreenerDate: strengthResponse.alnScreenerDate ? parseISO(strengthResponse.alnScreenerDate) : null,
})

export { toStrengthsList, toStrengthResponseDto }
