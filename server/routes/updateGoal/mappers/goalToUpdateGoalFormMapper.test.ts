import type { UpdateGoalForm } from 'forms'
import { parse, parseISO } from 'date-fns'
import { anotherValidStep, aValidGoal, aValidStep } from '../../../testsupport/actionPlanTestDataBuilder'
import { toUpdateGoalForm } from './goalToUpdateGoalFormMapper'
import StepStatusValue from '../../../enums/stepStatusValue'
import GoalStatusValue from '../../../enums/goalStatusValue'

describe('goalToUpdateGoalFormMapper', () => {
  describe('toUpdateGoalForm', () => {
    const now = new Date()

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
        createdAt: '2023-01-16T09:34:12Z',
        targetCompletionDate: '29/2/2024',
        manuallyEnteredTargetCompletionDate: null,
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
        originalTargetCompletionDate: '29/2/2024',
        status: GoalStatusValue.ACTIVE,
      }

      // When
      const actual = toUpdateGoalForm(goal)

      // Then
      expect(actual).toEqual(expectedUpdateGoalForm)
    })

    it('should map a Goal to an UpdateGoalForm given dates are not in BST', () => {
      // Given
      const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
      const step = aValidStep()
      const goal = aValidGoal({
        goalReference,
        steps: [step],
        createdAt: parseISO('2024-01-01T09:34:12Z'), // January is not BST
        targetCompletionDate: parse('2024-01-01', 'yyyy-MM-dd', now),
      })

      const expectedUpdateGoalForm: UpdateGoalForm = {
        reference: '1a2eae63-8102-4155-97cb-43d8fb739caf',
        title: 'Learn Spanish',
        note: 'Prisoner is not good at listening',
        createdAt: '2024-01-01T09:34:12Z',
        targetCompletionDate: '1/1/2024',
        manuallyEnteredTargetCompletionDate: null,
        steps: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            status: StepStatusValue.ACTIVE,
            stepNumber: 1,
          },
        ],
        originalTargetCompletionDate: '1/1/2024',
        status: GoalStatusValue.ACTIVE,
      }

      // When
      const actual = toUpdateGoalForm(goal)

      // Then
      expect(actual).toEqual(expectedUpdateGoalForm)
    })

    it('should map a Goal to an UpdateGoalForm given dates are in BST', () => {
      // Given
      const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
      const step = aValidStep()
      const goal = aValidGoal({
        goalReference,
        steps: [step],
        createdAt: parseISO('2024-08-10T09:34:12Z'), // August is in BST
        targetCompletionDate: parse('2024-08-10', 'yyyy-MM-dd', now),
      })

      const expectedUpdateGoalForm: UpdateGoalForm = {
        reference: '1a2eae63-8102-4155-97cb-43d8fb739caf',
        title: 'Learn Spanish',
        note: 'Prisoner is not good at listening',
        createdAt: '2024-08-10T09:34:12Z',
        targetCompletionDate: '10/8/2024',
        manuallyEnteredTargetCompletionDate: null,
        steps: [
          {
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            title: 'Book Spanish course',
            status: StepStatusValue.ACTIVE,
            stepNumber: 1,
          },
        ],
        originalTargetCompletionDate: '10/8/2024',
        status: GoalStatusValue.ACTIVE,
      }

      // When
      const actual = toUpdateGoalForm(goal)

      // Then
      expect(actual).toEqual(expectedUpdateGoalForm)
    })
  })
})
