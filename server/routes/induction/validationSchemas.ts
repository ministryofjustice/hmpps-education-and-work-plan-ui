import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../routerRequestHandlers/validationMiddleware'
import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
import SkillsValue from '../../enums/skillsValue'
import { asArray } from '../../utils/utils'

const hopingToWorkOnReleaseSchema = async (req: Request, res: Response) => {
  const { prisonerSummary } = res.locals
  const hopingToWorkMandatoryMessage = `Select whether ${prisonerSummary.firstName} ${prisonerSummary.lastName} is hoping to get work`
  return createSchema({
    hopingToGetWork: z //
      .nativeEnum(HopingToGetWorkValue, { message: hopingToWorkMandatoryMessage }),
  })
}

const skillsSchema = async (req: Request, res: Response) => {
  const MAX_OTHER_LENGTH = 255
  const { prisonerSummary } = res.locals
  const skillsMandatoryMessage = `Select the skills that ${prisonerSummary.firstName} ${prisonerSummary.lastName} feels they have or select 'None of these'`
  const skillsOtherMandatoryMessage = `Enter the skill that ${prisonerSummary.firstName} ${prisonerSummary.lastName} feels they have`
  const skillsOtherMaxLengthMessage = `The skill must be ${MAX_OTHER_LENGTH} characters or less`

  return createSchema({
    skills: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.nativeEnum(SkillsValue, { message: skillsMandatoryMessage }))
          .min(1, skillsMandatoryMessage),
      )
      .refine(skills => !(skills.length > 1 && skills.includes(SkillsValue.NONE)), skillsMandatoryMessage),
    skillsOther: z //
      .string()
      .max(MAX_OTHER_LENGTH, skillsOtherMaxLengthMessage)
      .optional(),
  }).refine(
    ({ skills, skillsOther }) => {
      if (skills?.includes(SkillsValue.OTHER)) {
        return (skillsOther ?? '') !== ''
      }
      return true
    },
    { path: ['skillsOther'], message: skillsOtherMandatoryMessage },
  )
}

export {
  //
  hopingToWorkOnReleaseSchema,
  skillsSchema,
}
