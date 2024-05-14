import type { CreateGoalsForm } from 'forms'
import validateCreateGoalsForm from './createGoalsFormValidator'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

describe('createGoalsFormValidator', () => {
  it('should validate given validators return no errors', () => {
    // Given
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: '',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].title', text: expect.any(String) }])
  })

  it('should validate given goal target completion date is not provided', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: undefined,
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#goals[0].targetCompletionDate', text: 'Select when they are aiming to achieve this goal by' },
    ])
  })

  it('should validate given goal target completion date errors', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: GoalTargetCompletionDateOption.ANOTHER_DATE,
          'targetCompletionDate-day': undefined,
          'targetCompletionDate-month': undefined,
          'targetCompletionDate-year': undefined,
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].targetCompletionDate', text: expect.any(String) }])
  })

  it('should validate given step title errors', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: '' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].steps[0].title', text: expect.any(String) }])
  })

  it('should validate given several errors in several goals and steps', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'This goal and its steps is OK',
          targetCompletionDate: GoalTargetCompletionDateOption.THREE_MONTHS,
          steps: [{ title: 'Book Spanish course' }],
        },
        {
          title: 'This goal is missing its date',
          targetCompletionDate: undefined,
          steps: [{ title: 'Book Spanish course' }],
        },
        {
          title: 'This goal is missing a step title',
          targetCompletionDate: GoalTargetCompletionDateOption.TWELVE_MONTHS,
          steps: [{ title: 'Book Spanish course' }, { title: '' }, { title: 'Attend Spanish course' }],
        },
        {
          title: '',
          targetCompletionDate: GoalTargetCompletionDateOption.SIX_MONTHS,
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#goals[1].targetCompletionDate', text: expect.any(String) },
      { href: '#goals[2].steps[1].title', text: expect.any(String) },
      { href: '#goals[3].title', text: expect.any(String) },
    ])
  })
})
