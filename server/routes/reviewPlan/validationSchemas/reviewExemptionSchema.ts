import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { ReviewPlanExemptionReason } from '../../../enums/reviewPlanExemptionReasonValue'
import { textValueExceedsLength } from '../../../validators/textValueValidator'

const reviewExemptionSchema = async () => {
  const MAX_EXEMPTION_REASON_LENGTH = 200

  const exemptionReasonMandatoryMessage = 'Select an exemption reason to put the review on hold'
  const exemptionReasonDetailsMaxLengthMessage = `Exemption details must be ${MAX_EXEMPTION_REASON_LENGTH} characters or less`

  return createSchema({
    exemptionReason: z //
      .enum(ReviewPlanExemptionReason, { message: exemptionReasonMandatoryMessage }),
    exemptionReasonDetails: z //
      .record(z.enum(ReviewPlanExemptionReason), z.string().optional())
      .optional()
      .nullable(),
  }).check(ctx => {
    const { exemptionReason, exemptionReasonDetails } = ctx.value
    if (!exemptionReasonDetails || !Object.prototype.hasOwnProperty.call(exemptionReasonDetails, exemptionReason)) {
      return
    }
    if (textValueExceedsLength(exemptionReasonDetails[exemptionReason], MAX_EXEMPTION_REASON_LENGTH)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: [exemptionReason],
        message: exemptionReasonDetailsMaxLengthMessage,
      })
    }
  })
}

export default reviewExemptionSchema
