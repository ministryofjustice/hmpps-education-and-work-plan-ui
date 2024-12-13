import type { ReviewExemptionDto } from 'dto'
import ReviewPlanExemptionReasonValue from '../enums/reviewPlanExemptionReasonValue'
import ReviewScheduleStatusValue from '../enums/reviewScheduleStatusValue'

const aValidReviewExemptionDto = (options?: {
  prisonId?: string
  prisonNumber?: string
  exemptionReason?: ReviewPlanExemptionReasonValue
  exemptionReasonDetails?: string
}): ReviewExemptionDto => ({
  prisonId: options?.prisonId || 'BXI',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  exemptionReason: options?.exemptionReason || ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
  exemptionReasonDetails: options?.exemptionReasonDetails,
})

export default aValidReviewExemptionDto
