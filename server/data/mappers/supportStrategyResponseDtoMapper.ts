import type { SupportStrategyResponseDto } from 'dto'
import type { SupportStrategyListResponse, SupportStrategyResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toSupportStrategyResponseDtos = (apiResponse: SupportStrategyListResponse): SupportStrategyResponseDto[] => {
  return ((apiResponse?.supportStrategies || []) as Array<SupportStrategyResponse>).map(toSupportStrategyResponseDto)
}

const toSupportStrategyResponseDto = (
  supportStrategyResponse: SupportStrategyResponse,
): SupportStrategyResponseDto => ({
  ...toReferenceAndAuditable(supportStrategyResponse),
  supportStrategyTypeCode: supportStrategyResponse.supportStrategyType.code,
  supportStrategyDetails: supportStrategyResponse.detail,
  supportStrategyCategory: supportStrategyResponse.supportStrategyType.categoryCode,
  active: supportStrategyResponse.active,
})

export { toSupportStrategyResponseDto, toSupportStrategyResponseDtos }
