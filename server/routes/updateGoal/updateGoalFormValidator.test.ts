import type { UpdateGoalForm } from 'forms'
import validateUpdateGoalForm from './updateGoalFormValidator'
import { aValidUpdateGoalForm } from '../../testsupport/updateGoalFormTestDataBuilder'
import GoalStatusValue from '../../enums/goalStatusValue'
import StepStatusValue from '../../enums/stepStatusValue'

describe('updateGoalFormValidator', () => {
  it('should validate given no errors', () => {
    // Given
    const form: UpdateGoalForm = aValidUpdateGoalForm()

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: undefined,
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      manuallyEnteredTargetCompletionDate: null,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: StepStatusValue.ACTIVE,
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
      status: GoalStatusValue.ACTIVE,
    }

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: expect.any(String) }])
  })

  it('should validate given goal target completion date errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: 'another-date',
      manuallyEnteredTargetCompletionDate: null,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: StepStatusValue.ACTIVE,
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
      status: GoalStatusValue.ACTIVE,
    }

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetCompletionDate', text: expect.any(String) }])
  })

  it('should validate given step title errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      manuallyEnteredTargetCompletionDate: null,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: undefined,
          stepNumber: 1,
          status: StepStatusValue.ACTIVE,
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
      status: GoalStatusValue.ACTIVE,
    }

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0][title]', text: expect.any(String) }])
  })

  it('should validate given step status errors', () => {
    const form: UpdateGoalForm = {
      reference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
      title: 'Learn Spanish',
      createdAt: '2023-01-16',
      targetCompletionDate: '2024-02-29',
      manuallyEnteredTargetCompletionDate: null,
      note: 'Prisoner is not good at listening',
      steps: [
        {
          reference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
          title: 'Book course',
          stepNumber: 1,
          status: undefined,
        },
      ],
      originalTargetCompletionDate: '2024-02-29',
      status: GoalStatusValue.ACTIVE,
    }

    // When
    const errors = validateUpdateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0][status]', text: expect.any(String) }])
  })
})
