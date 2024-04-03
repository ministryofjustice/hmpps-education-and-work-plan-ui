import type { CreateGoalsForm } from 'forms'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateStepTitle from '../../validators/stepTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'
import validateCreateGoalsForm from './createGoalsFormValidator'

jest.mock('../../validators/goalTitleValidator')
jest.mock('../../validators/goalTargetCompletionDateValidator')
jest.mock('../../validators/stepTitleValidator')

describe('createGoalsFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>
  const mockedValidateTargetCompletionDate = goalTargetCompletionDateValidator as jest.MockedFunction<
    typeof goalTargetCompletionDateValidator
  >
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>

  it('should validate given validators return no errors', () => {
    // Given
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])

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
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].title', text: 'some-title-error' }])
  })

  it('should validate given goal target completion date errors', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue(['some-target-completion-date-error'])
    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].targetCompletionDate', text: 'some-target-completion-date-error' }])
  })

  it('should validate given step title errors', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: '' }],
        },
      ],
    }

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue(['some-step-title-error'])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].steps[0].title', text: 'some-step-title-error' }])
  })

  it('should validate given several errors in several goals and steps', () => {
    const form: CreateGoalsForm = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'This goal and its steps is OK',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
        {
          title: 'This goal is missing its date',
          targetCompletionDate: '',
          steps: [{ title: 'Book Spanish course' }],
        },
        {
          title: 'This goal is missing a step title',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }, { title: '' }, { title: 'Attend Spanish course' }],
        },
        {
          title: '',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    }

    mockedValidateGoalTitle //
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['some-title-error'])
    mockedValidateTargetCompletionDate //
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['some-target-completion-date-error'])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
    mockedValidateStepTitle //
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['some-step-title-error'])
      .mockReturnValueOnce([])
      .mockReturnValueOnce([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#goals[1].targetCompletionDate', text: 'some-target-completion-date-error' },
      { href: '#goals[2].steps[1].title', text: 'some-step-title-error' },
      { href: '#goals[3].title', text: 'some-title-error' },
    ])
  })
})
