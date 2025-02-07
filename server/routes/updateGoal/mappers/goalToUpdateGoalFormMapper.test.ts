import type { UpdateGoalForm } from 'forms'
import { anotherValidStep, aValidGoal, aValidStep } from '../../../testsupport/actionPlanTestDataBuilder'
import { toUpdateGoalForm } from './goalToUpdateGoalFormMapper'
import StepStatusValue from '../../../enums/stepStatusValue'
import GoalStatusValue from '../../../enums/goalStatusValue'

describe('goalToUpdateGoalFormMapper', () => {
  describe('toUpdateGoalForm', () => {
    it('should map a Goal to an UpdateGoalForm', () => {
      // Given
      const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
      const step1 = aValidStep()
      const step2 = anotherValidStep()
      const goal = aValidGoal({ goalReference, steps: [step1, step2] })

      const expectedUpdateGoalForm: UpdateGoalForm = {
        reference: '1a2eae63-8102-4155-97cb-43d8fb739caf',
        title: 'Learn Spanish',
        note: 'Prisoner is not good at listening',
        createdAt: '2023-01-16T09:34:12.453Z',
        targetCompletionDate: '2024-02-29',
        'targetCompletionDate-day': null,
        'targetCompletionDate-month': null,
        'targetCompletionDate-year': null,
        steps: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            status: StepStatusValue.ACTIVE,
            stepNumber: 1,
          },
          {
            reference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
            title: 'Complete Spanish course',
            status: StepStatusValue.NOT_STARTED,
            stepNumber: 2,
          },
        ],
        originalTargetCompletionDate: '2024-02-29',
        status: GoalStatusValue.ACTIVE,
      }

      // When
      const actual = toUpdateGoalForm(goal)

      // Then
      expect(actual).toEqual(expectedUpdateGoalForm)
    })
  })
})
