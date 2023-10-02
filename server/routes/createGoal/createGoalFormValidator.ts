import type { CreateGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'

export default function validateCreateGoalForm(createGoalForm: CreateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(createGoalForm.title)))
  errors.push(
    ...formatErrors(
      'targetCompletionDate',
      goalTargetCompletionDateValidator(
        createGoalForm.targetCompletionDate,
        createGoalForm['targetCompletionDate-day'],
        createGoalForm['targetCompletionDate-month'],
        createGoalForm['targetCompletionDate-year'],
      ),
    ),
  )
  return errors
}
