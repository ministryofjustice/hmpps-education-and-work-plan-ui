import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

const previousWorkExperienceTypesSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 256
  const { prisonerSummary } = res.locals
  const typeOfWorkExperienceMandatoryMessage = `Select the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} has done before`
  const typeOfWorkExperienceOtherMandatoryMessage = `Enter the type of work ${prisonerSummary.firstName} ${prisonerSummary.lastName} has done before`
  const typeOfWorkExperienceOtherMaxLengthMessage = `The type of work must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    typeOfWorkExperience: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(TypeOfWorkExperienceValue, { message: typeOfWorkExperienceMandatoryMessage }))
          .min(1, typeOfWorkExperienceMandatoryMessage),
      ),
    typeOfWorkExperienceOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, typeOfWorkExperienceOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ typeOfWorkExperience, typeOfWorkExperienceOther }) => {
      if (typeOfWorkExperience?.includes(TypeOfWorkExperienceValue.OTHER)) {
        return (typeOfWorkExperienceOther ?? '') !== ''
      }
      return true
    },
    { path: ['typeOfWorkExperienceOther'], message: typeOfWorkExperienceOtherMandatoryMessage },
  )
}

export default previousWorkExperienceTypesSchema
