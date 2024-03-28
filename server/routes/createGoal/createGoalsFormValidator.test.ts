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
    const form = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    } as CreateGoalsForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: '',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    } as CreateGoalsForm

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].title', text: 'some-title-error' }])
  })

  it('should validate given goal target completion date errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '',
          steps: [{ title: 'Book Spanish course' }],
        },
      ],
    } as CreateGoalsForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue(['some-target-completion-date-error'])
    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#goals[0].targetCompletionDate', text: 'some-target-completion-date-error' }])
  })

  it('should validate given step title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      goals: [
        {
          title: 'Learn Spanish',
          targetCompletionDate: '2024-02-26',
          steps: [{ title: '' }],
        },
      ],
    } as CreateGoalsForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue([])
    mockedValidateStepTitle.mockReturnValue(['some-step-title-error'])

    // When
    const errors = validateCreateGoalsForm(form)

    // Then
    expect(errors).toEqual([{ href: '#steps[0].title', text: 'some-step-title-error' }])
  })
})
