import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import WorkInterestTypeValue from '../../../enums/workInterestTypeValue'

const workInterestTypesSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const workInterestTypesMandatoryMessage = `Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} is interested in`
  const workInterestTypesOtherMandatoryMessage = `Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} is interested in`
  const workInterestTypesOtherMaxLengthMessage = `The type of work must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    workInterestTypes: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(WorkInterestTypeValue, { message: workInterestTypesMandatoryMessage }))
          .min(1, workInterestTypesMandatoryMessage),
      ),
    workInterestTypesOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, workInterestTypesOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ workInterestTypes, workInterestTypesOther }) => {
      if (workInterestTypes?.includes(WorkInterestTypeValue.OTHER)) {
        return (workInterestTypesOther ?? '') !== ''
      }
      return true
    },
    { path: ['workInterestTypesOther'], message: workInterestTypesOtherMandatoryMessage },
  )
}

export default workInterestTypesSchema
