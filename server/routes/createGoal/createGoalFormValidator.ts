import type { CreateGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'

export default function validateCreateGoalForm(createGoalForm: CreateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(createGoalForm.title)))

  if (!createGoalForm.targetCompletionDate) {
    errors.push(...formatErrors('targetCompletionDate', ['Select when they are aiming to achieve this goal by']))
  } else if (createGoalForm.targetCompletionDate === 'another-date') {
    errors.push(
      ...formatErrors(
        'targetCompletionDate',
        goalTargetCompletionDateValidator(
          createGoalForm['targetCompletionDate-day'],
          createGoalForm['targetCompletionDate-month'],
          createGoalForm['targetCompletionDate-year'],
        ),
      ),
    )
  }
  return errors
}
