import type { CreateGoalForm } from 'forms'
import validateGoalTitle from '../../validators/goalTitleValidator'
import goalTargetCompletionDateValidator from '../../validators/goalTargetCompletionDateValidator'
import validateCreateGoalForm from './createGoalFormValidator'

jest.mock('../../validators/goalTitleValidator')
jest.mock('../../validators/goalTargetCompletionDateValidator')

describe('createGoalFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>
  const mockedValidateTargetCompletionDate = goalTargetCompletionDateValidator as jest.MockedFunction<
    typeof goalTargetCompletionDateValidator
  >

  it('should validate given validators return no errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: '2024-02-26',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue([])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      title: '',
      targetCompletionDate: '2024-02-26',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateTargetCompletionDate.mockReturnValue([])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })

  it('should validate given goal title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: '',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateTargetCompletionDate.mockReturnValue(['some-target-completion-date-error'])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetCompletionDate', text: 'some-target-completion-date-error' }])
  })
})
