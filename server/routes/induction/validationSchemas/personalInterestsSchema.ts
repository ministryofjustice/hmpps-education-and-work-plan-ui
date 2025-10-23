import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'

const personalInterestsSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const personalInterestsMandatoryMessage = `Select ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s interests or select 'None of these'`
  const personalInterestsOtherMandatoryMessage = `Enter ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s interests`
  const personalInterestsOtherMaxLengthMessage = `The interests must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    personalInterests: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(PersonalInterestsValue, { message: personalInterestsMandatoryMessage }))
          .min(1, personalInterestsMandatoryMessage),
      )
      .refine(
        personalInterests => !(personalInterests.length > 1 && personalInterests.includes(PersonalInterestsValue.NONE)),
        personalInterestsMandatoryMessage,
      ),
    personalInterestsOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, personalInterestsOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ personalInterests, personalInterestsOther }) => {
      if (personalInterests?.includes(PersonalInterestsValue.OTHER)) {
        return (personalInterestsOther ?? '') !== ''
      }
      return true
    },
    { path: ['personalInterestsOther'], message: personalInterestsOtherMandatoryMessage },
  )
}

export default personalInterestsSchema
