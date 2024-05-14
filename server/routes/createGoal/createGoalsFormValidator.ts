import type { CreateGoalsForm } from 'forms'
import formatErrors from '../errorFormatter'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

export default function validateCreateGoalsForm(createGoalsForm: CreateGoalsForm): Array<Record<string, string>> {
  const errors: Array<Record<string, string>> = []

  createGoalsForm.goals.forEach((goal, goalIndex) => {
    errors.push(...formatErrors(`goals[${goalIndex}].title`, validateGoalTitle(goal.title)))

    if (!goal.targetCompletionDate) {
      errors.push(
        ...formatErrors(`goals[${goalIndex}].targetCompletionDate`, [
          'Select when they are aiming to achieve this goal by',
        ]),
      )
    } else if (goal.targetCompletionDate === GoalTargetCompletionDateOption.ANOTHER_DATE) {
      errors.push(
        ...formatErrors(
          `goals[${goalIndex}].targetCompletionDate`,
          goalTargetCompletionDateValidator(
            goal['targetCompletionDate-day'],
            goal['targetCompletionDate-month'],
            goal['targetCompletionDate-year'],
          ),
        ),
      )
    }

    goal.steps.forEach((step, stepIndex) => {
      errors.push(...formatErrors(`goals[${goalIndex}].steps[${stepIndex}].title`, validateStepTitle(step.title)))
    })
  })

  return errors
}
