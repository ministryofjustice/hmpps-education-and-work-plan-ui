import type { CreateGoalsForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'

export default function validateCreateGoalsForm(createGoalsForm: CreateGoalsForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('goals[0].title', validateGoalTitle(createGoalsForm.goals[0].title)))
  errors.push(
    ...formatErrors(
      'goals[0].targetCompletionDate',
      goalTargetCompletionDateValidator(
        createGoalsForm.goals[0].targetCompletionDate,
        createGoalsForm.goals[0]['targetCompletionDate-day'],
        createGoalsForm.goals[0]['targetCompletionDate-month'],
        createGoalsForm.goals[0]['targetCompletionDate-year'],
      ),
    ),
  )
  createGoalsForm.goals[0].steps.forEach((step, idx) => {
    errors.push(...formatErrors(`steps[${idx}].title`, validateStepTitle(step.title)))
  })
  return errors
}
