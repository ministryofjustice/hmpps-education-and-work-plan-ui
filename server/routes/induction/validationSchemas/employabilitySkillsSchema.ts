import { z } from 'zod'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import { asArray } from '../../../utils/utils'

const employabilitySkillsSchema = async () => {
  const employabilitySkillsMandatoryMessage = `Select a skill or 'none'`
  const ratingMandatoryMessage = 'Select a confidence level for the chosen skill'

  return createSchema({
    employabilitySkills: z //
      .preprocess(
        val => asArray(val),
        z //
          .array(z.enum(EmployabilitySkillsValue, { message: employabilitySkillsMandatoryMessage }), {
            message: employabilitySkillsMandatoryMessage,
          })
          .min(1, { message: employabilitySkillsMandatoryMessage }),
      ),
    rating: z //
      .record(
        z.enum(EmployabilitySkillsValue),
        z.preprocess(
          (val: EmployabilitySkillRatingValue) =>
            Object.keys(EmployabilitySkillRatingValue).includes(val) ? val : undefined,
          z.enum(EmployabilitySkillRatingValue).optional(),
        ),
      )
      .optional()
      .nullable(),
  }).check(ctx => {
    const { employabilitySkills, rating } = ctx.value

    if (employabilitySkills.length === 1 && employabilitySkills.includes(EmployabilitySkillsValue.NONE)) {
      return
    }

    if (employabilitySkills.length > 1 && employabilitySkills.includes(EmployabilitySkillsValue.NONE)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['employabilitySkills'],
        message: employabilitySkillsMandatoryMessage,
      })
      return
    }

    employabilitySkills.forEach(skillType => {
      if (!rating || !rating[skillType]) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [`rating[${skillType}]`],
          message: ratingMandatoryMessage,
        })
      }
    })
  })
}

export default employabilitySkillsSchema
