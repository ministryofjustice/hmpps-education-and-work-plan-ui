import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import { asArray } from '../../../utils/utils'
import AbilityToWorkValue from '../../../enums/abilityToWorkValue'

const affectAbilityToWorkSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const affectAbilityToWorkMandatoryMessage = `Select factors affecting ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ability to work or select 'None of these'`
  const affectAbilityToWorkOtherMandatoryMessage = `Enter factors affecting ${prisonerSummary.firstName} ${prisonerSummary.lastName}'s ability to work`
  const affectAbilityToWorkOtherMaxLengthMessage = `The factors affecting ability to work must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    affectAbilityToWork: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(AbilityToWorkValue, { message: affectAbilityToWorkMandatoryMessage }))
          .min(1, affectAbilityToWorkMandatoryMessage),
      )
      .refine(
        factorsAffectingWork =>
          !(factorsAffectingWork.length > 1 && factorsAffectingWork.includes(AbilityToWorkValue.NONE)),
        affectAbilityToWorkMandatoryMessage,
      ),
    affectAbilityToWorkOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, affectAbilityToWorkOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ affectAbilityToWork, affectAbilityToWorkOther }) => {
      if (affectAbilityToWork?.includes(AbilityToWorkValue.OTHER)) {
        return (affectAbilityToWorkOther ?? '') !== ''
      }
      return true
    },
    { path: ['affectAbilityToWorkOther'], message: affectAbilityToWorkOtherMandatoryMessage },
  )
}

export default affectAbilityToWorkSchema
