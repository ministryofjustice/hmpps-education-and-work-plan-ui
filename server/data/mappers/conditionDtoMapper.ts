import type { ConditionDto, ConditionsList } from 'dto'
import type { ConditionListResponse, ConditionResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toConditionsList = (conditionListResponse: ConditionListResponse, prisonNumber: string): ConditionsList => ({
  prisonNumber,
  conditions: conditionListResponse?.conditions.map(toConditionDto) || [],
})

const toConditionDto = (conditionResponse: ConditionResponse): ConditionDto => ({
  ...toReferenceAndAuditable(conditionResponse),
  conditionTypeCode: conditionResponse.conditionType.code,
  conditionName: conditionResponse.conditionName,
  conditionDetails: conditionResponse.conditionDetails,
  source: conditionResponse.source,
  active: conditionResponse.active,
})

export { toConditionsList, toConditionDto }
