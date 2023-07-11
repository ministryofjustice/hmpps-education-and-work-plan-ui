import type { CreateGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'

export default function validateCreateGoalForm(createGoalForm: CreateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(createGoalForm.title)))
  return errors
}
