import type { ConditionListResponse, ConditionResponse } from 'supportAdditionalNeedsApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import ConditionSource from '../enums/conditionSource'

const aValidConditionListResponse = (options?: {
  conditionResponses?: Array<ConditionResponse>
}): ConditionListResponse => ({
  conditions: options?.conditionResponses || [aValidConditionResponse()],
})

const aValidConditionResponse = (
  options?: AuditFields & {
    active?: boolean
    conditionTypeCode?: string
    source?: ConditionSource
    conditionDetails?: string
    conditionName?: string
  },
): ConditionResponse => ({
  active: options?.active == null ? true : options?.active,
  source: options?.source || ConditionSource.SELF_DECLARED,
  conditionDetails:
    options?.conditionDetails === null
      ? null
      : options?.conditionDetails ||
        'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionType: {
    code: options?.conditionTypeCode || 'DYSLEXIA',
  },
  conditionName: options?.conditionName === null ? null : options?.conditionName || 'Phonological dyslexia',
  ...validAuditFields(options),
})

export { aValidConditionResponse, aValidConditionListResponse }
