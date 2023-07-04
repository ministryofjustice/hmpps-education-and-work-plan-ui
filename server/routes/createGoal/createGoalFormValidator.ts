import type { CreateGoalForm } from 'forms'
import validateGoalReviewDate from '../../validators/goalReviewDateValidator'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'

export default function validateCreateGoalForm(createGoalForm: CreateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(createGoalForm.title)))
  errors.push(...formatErrors('reviewDate', validateGoalReviewDate(createGoalForm.reviewDate)))
  return errors
}
