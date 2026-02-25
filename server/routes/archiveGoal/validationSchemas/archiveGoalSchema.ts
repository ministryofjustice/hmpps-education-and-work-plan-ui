import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { textValueExceedsLength } from '../../../validators/textValueValidator'
import ReasonToArchiveGoalValue from '../../../enums/ReasonToArchiveGoalValue'

const archiveGoalSchema = async () => {
  const MAX_REASON_OTHER_LENGTH = 200

  const reasonMandatoryMessage = 'Select a reason to archive the goal'
  const reasonOtherMandatoryMessage = 'Enter the reason you are archiving the goal'
  const reasonOtherMaxLengthMessage = `The reason must be ${MAX_REASON_OTHER_LENGTH} characters or less`

  return createSchema({
    reason: z //
      .enum(ReasonToArchiveGoalValue, { message: reasonMandatoryMessage }),
    reasonOther: z //
      .string()
      .optional()
      .nullable(),
    notes: z //
      .string()
      .optional()
      .nullable(),
    reference: z.any(),
    title: z.any(),
  }).check(ctx => {
    const { reason, reasonOther } = ctx.value
    if (reason !== ReasonToArchiveGoalValue.OTHER) {
      return
    }
    if (!reasonOther) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['reasonOther'],
        message: reasonOtherMandatoryMessage,
      })
    } else if (textValueExceedsLength(reasonOther, MAX_REASON_OTHER_LENGTH)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['reasonOther'],
        message: reasonOtherMaxLengthMessage,
      })
    }
  })
}

export default archiveGoalSchema
