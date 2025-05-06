import type { UpdateGoalForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepStatus from '../../validators/stepStatusValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'

export default function validateUpdateGoalForm(updateGoalForm: UpdateGoalForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  errors.push(...formatErrors('title', validateGoalTitle(updateGoalForm.title)))
  if (updateGoalForm.targetCompletionDate === 'another-date') {
    errors.push(
      ...formatErrors(
        'targetCompletionDate',
        goalTargetCompletionDateValidator(updateGoalForm.manuallyEnteredTargetCompletionDate),
      ),
    )
  }
  updateGoalForm.steps.forEach((step, idx) => {
    errors.push(...formatErrors(`steps[${idx}][title]`, validateStepTitle(step.title)))
    errors.push(...formatErrors(`steps[${idx}][status]`, validateStepStatus(step.status)))
  })
  return errors
}
