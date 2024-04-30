import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { GoalForm } from './GoalForm'
import { flattenErrors } from '../../../middleware/validationMiddleware'

describe('GoalForm', () => {
  it('should validate given validators return no errors', async () => {
    // Given
    const body = {
      title: 'Learn Spanish',
      targetCompletionDate: '2024-02-26',
      steps: [{ title: 'Book Spanish course' }],
    }

    // When
    const goalForm = plainToInstance(GoalForm, body)
    const validationErrors = await validate(goalForm)

    // Then
    expect(validationErrors).toHaveLength(0)
  })

  it('should validate given goal title errors', async () => {
    // Given
    const body = {
      title: '',
      targetCompletionDate: '2024-02-26',
      steps: [{ title: 'Book Spanish course' }],
    }

    // When
    const goalForm = plainToInstance(GoalForm, body)
    const validationErrors = flattenErrors(await validate(goalForm))

    // Then
    expect(validationErrors).toEqual([
      {
        field: 'title',
        message: 'Enter the goal description',
      },
    ])
  })

  it('should validate given goal target completion date errors', async () => {
    const body = {
      title: 'Learn Spanish',
      targetCompletionDate: '',
      steps: [{ title: 'Book Spanish course' }],
    }

    // When
    const goalForm = plainToInstance(GoalForm, body)
    const validationErrors = flattenErrors(await validate(goalForm))

    // Then
    expect(validationErrors).toEqual([
      {
        field: 'targetCompletionDate',
        message: 'Select when they are aiming to achieve this goal by',
      },
    ])
  })

  it('should validate given step title errors', async () => {
    const body = {
      title: 'Learn Spanish',
      targetCompletionDate: '2024-02-26',
      steps: [{ title: '' }],
    }

    // When
    const goalForm = plainToInstance(GoalForm, body)
    const validationErrors = flattenErrors(await validate(goalForm))

    // Then
    expect(validationErrors).toEqual([
      {
        field: 'steps-0-title',
        message: 'Enter the step needed to work towards the goal',
      },
    ])
  })

  it('should validate given several errors in several goals and steps', async () => {
    const body = {
      title: '',
      targetCompletionDate: 'another-date',
      steps: [{ title: '' }],
    }

    // When
    const goalForm = plainToInstance(GoalForm, body)
    const errors = await validate(goalForm)
    const validationErrors = flattenErrors(errors)

    // Then
    expect(validationErrors).toEqual([
      {
        field: 'title',
        message: 'Enter the goal description',
      },
      {
        field: 'anotherDate',
        message: 'Enter a valid date for when they are aiming to achieve this goal by',
      },
      {
        field: 'steps-0-title',
        message: 'Enter the step needed to work towards the goal',
      },
    ])
  })
})
