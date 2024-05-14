import type { CreateGoalForm } from 'forms'
import validateCreateGoalForm from './createGoalFormValidator'

describe('createGoalFormValidator', () => {
  it('should validate given validators return no errors', () => {
    // Given
    const form: CreateGoalForm = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: '2024-02-26',
      'targetCompletionDate-day': undefined,
      'targetCompletionDate-month': undefined,
      'targetCompletionDate-year': undefined,
    }

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form: CreateGoalForm = {
      prisonNumber: 'A1234BC',
      title: '',
      targetCompletionDate: '2024-02-26',
      'targetCompletionDate-day': undefined,
      'targetCompletionDate-month': undefined,
      'targetCompletionDate-year': undefined,
    }

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: expect.any(String) }])
  })

  it('should validate given goal target completion date is not provided', () => {
    const form: CreateGoalForm = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: '',
      'targetCompletionDate-day': undefined,
      'targetCompletionDate-month': undefined,
      'targetCompletionDate-year': undefined,
    }

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#targetCompletionDate', text: 'Select when they are aiming to achieve this goal by' },
    ])
  })

  it('should validate given goal target completion date errors', () => {
    const form: CreateGoalForm = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: 'another-date',
      'targetCompletionDate-day': undefined,
      'targetCompletionDate-month': undefined,
      'targetCompletionDate-year': undefined,
    }

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetCompletionDate', text: expect.any(String) }])
  })
})
