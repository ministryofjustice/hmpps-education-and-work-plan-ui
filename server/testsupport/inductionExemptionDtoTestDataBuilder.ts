import type { InductionExemptionDto } from 'inductionDto'
import InductionExemptionReasonValue from '../enums/inductionExemptionReasonValue'
import InductionScheduleStatusValue from '../enums/inductionScheduleStatusValue'

const aValidInductionExemptionDto = (options?: {
  prisonId?: string
  prisonNumber?: string
  exemptionReason?: InductionExemptionReasonValue
  exemptionReasonDetails?: string
}): InductionExemptionDto => ({
  prisonId: options?.prisonId || 'BXI',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  exemptionReason: options?.exemptionReason || InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
  exemptionReasonDetails: options?.exemptionReasonDetails,
})

export default aValidInductionExemptionDto
