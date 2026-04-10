import { z } from 'zod'
import { getYear, isBefore, isValid, parse, startOfToday } from 'date-fns'
import { createSchema } from '../../routerRequestHandlers/validationMiddleware'
import StepStatusValue from '../../../enums/stepStatusValue'
import { asArray } from '../../../utils/utils'

const updateGoalSchema = async () => {
  const MAX_GOAL_TITLE_LENGTH = 512
  const MAX_STEP_TITLE_LENGTH = 512
  const DATE_PATTERN = '(\\d{1,2}\\/\\d{1,2}\\/\\d{4})'
  const ANOTHER_DATE_PATTERN = '(another-date)'
  const TARGET_COMPLETION_DATE_PATTERN = new RegExp(`^${DATE_PATTERN}|${ANOTHER_DATE_PATTERN}$`)

  const goalTitleMandatoryMessage = 'Enter the goal description'
  const goalTitleMaxLengthMessage = `The goal description must be ${MAX_GOAL_TITLE_LENGTH} characters or less`
  const targetCompletionDateMessage = 'Select the target completion date or set another date'
  const manuallyEnteredTargetCompletionDateMandatoryMessage =
    'Enter a valid date for when they are aiming to achieve this goal by'
  const manuallyEnteredTargetCompletionDateInvalidMessage = 'Enter a valid date. Date must be in the future'

  const stepTitleMandatoryMessage = 'Enter the step needed to work towards the goal'
  const stepTitleMaxLengthMessage = `The step description must be ${MAX_STEP_TITLE_LENGTH} characters or less`

  return createSchema({
    title: z //
      .string({ message: goalTitleMandatoryMessage })
      .trim()
      .min(1, goalTitleMandatoryMessage)
      .max(MAX_GOAL_TITLE_LENGTH, goalTitleMaxLengthMessage),
    targetCompletionDate: z //
      .string({ message: targetCompletionDateMessage })
      .regex(TARGET_COMPLETION_DATE_PATTERN, targetCompletionDateMessage),
    manuallyEnteredTargetCompletionDate: z //
      .string()
      .optional()
      .nullable(),
    note: z //
      .string()
      .optional()
      .nullable(),

    steps: z //
      .preprocess(
        val => asArray(val),
        z
          .array(
            z.object({
              status: z //
                .enum(StepStatusValue),
              title: z //
                .string({ message: stepTitleMandatoryMessage })
                .trim()
                .min(1, stepTitleMandatoryMessage)
                .max(MAX_STEP_TITLE_LENGTH, stepTitleMaxLengthMessage),
              stepNumber: z.coerce.number(),
              reference: z.any(),
              action: z.any(),
            }),
          )
          .min(1),
      ),
    reference: z.any(),
    createdAt: z.any(),
    originalTargetCompletionDate: z.any(),
    status: z.any(),
    action: z.any(),
  }).check(ctx => {
    const { targetCompletionDate, manuallyEnteredTargetCompletionDate } = ctx.value
    const today = startOfToday()

    const targetCompletionDateIsAnotherDate = new RegExp(ANOTHER_DATE_PATTERN).test(targetCompletionDate)
    if (targetCompletionDateIsAnotherDate) {
      // Validate the manuallyEnteredTargetCompletionDate is a valid date
      const date = parse(manuallyEnteredTargetCompletionDate || '', 'd/M/yyyy', today)
      if (!(isValid(date) && getYear(date) >= 1900)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['targetCompletionDate'],
          message: manuallyEnteredTargetCompletionDateMandatoryMessage,
        })
      } else if (isBefore(date, today)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['targetCompletionDate'],
          message: manuallyEnteredTargetCompletionDateInvalidMessage,
        })
      }
    } else {
      // Validate the targetCompletionDate is a valid date
      const date = parse(targetCompletionDate, 'd/M/yyyy', today)
      if (!(isValid(date) && getYear(date) >= 1900) && !isBefore(date, today)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['targetCompletionDate'],
          message: targetCompletionDateMessage,
        })
      }
    }
  })
}

export default updateGoalSchema
