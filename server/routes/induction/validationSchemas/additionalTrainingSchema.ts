import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import AdditionalTrainingValue from '../../../enums/additionalTrainingValue'

const additionalTrainingSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const additionalTrainingMandatoryMessage = `Select the type of training or vocational qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} has`
  const additionalTrainingOtherMandatoryMessage = `Enter the type of training or vocational qualification ${prisonerSummary.firstName} ${prisonerSummary.lastName} has`
  const additionalTrainingOtherMaxLengthMessage = `The type of training must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    additionalTraining: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(AdditionalTrainingValue, { message: additionalTrainingMandatoryMessage }))
          .min(1, additionalTrainingMandatoryMessage),
      )
      .refine(
        additionalTraining =>
          !(additionalTraining.length > 1 && additionalTraining.includes(AdditionalTrainingValue.NONE)),
        additionalTrainingMandatoryMessage,
      ),
    additionalTrainingOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, additionalTrainingOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ additionalTraining, additionalTrainingOther }) => {
      if (additionalTraining?.includes(AdditionalTrainingValue.OTHER)) {
        return (additionalTrainingOther ?? '') !== ''
      }
      return true
    },
    { path: ['additionalTrainingOther'], message: additionalTrainingOtherMandatoryMessage },
  )
}

export default additionalTrainingSchema
