import type { CreateGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateTargetDate from '../../validators/goalTargetDateValidator'
import validateDate from '../../validators/dateValidator'

export default function validateCreateGoalForm(createGoalForm: CreateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(createGoalForm.title)))
  errors.push(...formatErrors('targetCompletionDate', validateTargetDate(createGoalForm.targetCompletionDate)))

  if (createGoalForm.targetCompletionDate === 'another-date') {
    errors.push(
      ...formatErrors(
        'another-date',
        validateDate(
          createGoalForm['targetCompletionDate-year'],
          createGoalForm['targetCompletionDate-month'],
          createGoalForm['targetCompletionDate-year'],
        ),
      ),
    )
  }
  return errors
}
