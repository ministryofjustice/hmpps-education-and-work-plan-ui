import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import InPrisonWorkValue from '../../../enums/inPrisonWorkValue'

const inPrisonWorkSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const inPrisonWorkMandatoryMessage = `Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`
  const inPrisonWorkOtherMandatoryMessage = `Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} would like to do in prison`
  const inPrisonWorkOtherMaxLengthMessage = `The type of work must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    inPrisonWork: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(InPrisonWorkValue, { message: inPrisonWorkMandatoryMessage }))
          .min(1, inPrisonWorkMandatoryMessage),
      ),
    inPrisonWorkOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, inPrisonWorkOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ inPrisonWork, inPrisonWorkOther }) => {
      if (inPrisonWork?.includes(InPrisonWorkValue.OTHER)) {
        return (inPrisonWorkOther ?? '') !== ''
      }
      return true
    },
    { path: ['inPrisonWorkOther'], message: inPrisonWorkOtherMandatoryMessage },
  )
}

export default inPrisonWorkSchema
