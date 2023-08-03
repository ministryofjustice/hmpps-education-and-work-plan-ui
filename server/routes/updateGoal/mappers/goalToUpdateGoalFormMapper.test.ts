import type { UpdateGoalForm } from 'forms'
import { anotherValidStep, aValidGoal, aValidStep } from '../../../testsupport/actionPlanTestDataBuilder'
import { toUpdateGoalForm } from './goalToUpdateGoalFormMapper'

describe('goalToUpdateGoalFormMapper', () => {
  describe('toUpdateGoalForm', () => {
    it('should map a Goal to an UpdateGoalForm', () => {
      // Given
      const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
      const step1 = aValidStep()
      const step2 = anotherValidStep()
      const goal = aValidGoal(goalReference, [step1, step2])

      const expectedUpdateGoalForm: UpdateGoalForm = {
        reference: '1a2eae63-8102-4155-97cb-43d8fb739caf',
        title: 'Learn Spanish',
        note: 'Prisoner is not good at listening',
        reviewDate: undefined,
        status: 'ACTIVE',
        steps: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            targetDateRange: 'ZERO_TO_THREE_MONTHS',
            status: 'ACTIVE',
            stepNumber: 1,
          },
          {
            reference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
            title: 'Complete Spanish course',
            targetDateRange: 'THREE_TO_SIX_MONTHS',
            status: 'NOT_STARTED',
            stepNumber: 2,
          },
        ],
      }

      // When
      const actual = toUpdateGoalForm(goal)

      // Then
      expect(actual).toEqual(expectedUpdateGoalForm)
    })
  })
})
