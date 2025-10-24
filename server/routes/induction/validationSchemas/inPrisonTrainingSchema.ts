import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import InPrisonTrainingValue from '../../../enums/inPrisonTrainingValue'

const inPrisonTrainingSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const inPrisonTrainingMandatoryMessage = `Select the type of training ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`
  const inPrisonTrainingOtherMandatoryMessage = `Enter the type of type of training ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`
  const inPrisonTrainingOtherMaxLengthMessage = `The type of training must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    inPrisonTraining: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(InPrisonTrainingValue, { message: inPrisonTrainingMandatoryMessage }))
          .min(1, inPrisonTrainingMandatoryMessage),
      ),
    inPrisonTrainingOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, inPrisonTrainingOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ inPrisonTraining, inPrisonTrainingOther }) => {
      if (inPrisonTraining?.includes(InPrisonTrainingValue.OTHER)) {
        return (inPrisonTrainingOther ?? '') !== ''
      }
      return true
    },
    { path: ['inPrisonTrainingOther'], message: inPrisonTrainingOtherMandatoryMessage },
  )
}

export default inPrisonTrainingSchema
