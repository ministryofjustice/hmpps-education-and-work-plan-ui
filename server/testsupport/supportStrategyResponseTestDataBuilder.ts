import type { SupportStrategyListResponse, SupportStrategyResponse } from 'supportAdditionalNeedsApiClient'
import { validAuditFields, AuditFields } from './auditFieldsTestDataBuilder'

const aValidSupportStrategyListResponse = (options?: {
  supportStrategies?: Array<SupportStrategyResponse>
}): SupportStrategyListResponse => ({
  supportStrategies: options?.supportStrategies || [aValidSupportStrategyResponse()],
})

const aValidSupportStrategyResponse = (
  options?: AuditFields & {
    active?: boolean
    supportStrategyType?: string
    supportStrategyCategory?: string
    detail?: string
  },
): SupportStrategyResponse => ({
  active: options?.active == null ? true : options?.active,
  detail: options?.detail === null ? null : options?.detail || 'Using flash cards with John can help him retain facts',
  supportStrategyType: {
    code: options?.supportStrategyType || 'MEMORY',
    categoryCode: options?.supportStrategyCategory || 'MEMORY',
  },
  ...validAuditFields(options),
})

export { aValidSupportStrategyResponse, aValidSupportStrategyListResponse }
