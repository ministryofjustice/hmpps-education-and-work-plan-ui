import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { parseISO } from 'date-fns'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toChallengeDto = (apiResponse: ChallengeListResponse): ChallengeResponseDto[] => {
  return (apiResponse?.challenges || []).map(toChallengeResponseDto)
}

const toChallengeResponseDto = (challenge: ChallengeResponse): ChallengeResponseDto => {
  return {
    ...toReferenceAndAuditable(challenge),
    fromALNScreener: challenge.fromALNScreener,
    challengeTypeCode: challenge.challengeType.code,
    challengeCategory: challenge.challengeType.categoryCode,
    symptoms: challenge.symptoms,
    howIdentified: challenge.howIdentified,
    active: challenge.active,
    howIdentifiedOther: challenge.howIdentifiedOther,
    alnScreenerDate: challenge.alnScreenerDate ? parseISO(challenge.alnScreenerDate) : null,
  } as ChallengeResponseDto
}

export { toChallengeDto, toChallengeResponseDto }
