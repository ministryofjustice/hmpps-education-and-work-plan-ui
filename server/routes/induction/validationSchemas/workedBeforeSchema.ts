import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import HasWorkedBeforeValue from '../../../enums/hasWorkedBeforeValue'

const workedBeforeSchema = async (req: Request, res: Response) => {
  const MAX_NOT_RELEVANT_LENGTH = 512
  const { prisonerSummary } = res.locals
  const hasWorkedBeforeMandatoryMessage = `Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} has worked before or not`
  const hasWorkedBeforeNotRelevantReasonMandatoryMessage = 'Enter the reason why not relevant'
  const hasWorkedBeforeNotRelevantReasonMaxLengthMessage = `The reason must be ${MAX_NOT_RELEVANT_LENGTH} characters or less`

  return createSchema({
    hasWorkedBefore: z //
      .enum(HasWorkedBeforeValue, { message: hasWorkedBeforeMandatoryMessage }),
    hasWorkedBeforeNotRelevantReason: z //
      .string()
      .max(MAX_NOT_RELEVANT_LENGTH, hasWorkedBeforeNotRelevantReasonMaxLengthMessage)
      .optional()
      .nullable(),
  }).refine(
    ({ hasWorkedBefore, hasWorkedBeforeNotRelevantReason }) => {
      if (hasWorkedBefore === HasWorkedBeforeValue.NOT_RELEVANT) {
        return (hasWorkedBeforeNotRelevantReason ?? '') !== ''
      }
      return true
    },
    { path: ['hasWorkedBeforeNotRelevantReason'], message: hasWorkedBeforeNotRelevantReasonMandatoryMessage },
  )
}

export default workedBeforeSchema
