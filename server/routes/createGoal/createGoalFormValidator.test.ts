import type { CreateGoalForm } from 'forms'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateCreateGoalForm from './createGoalFormValidator'

jest.mock('../../validators/goalTitleValidator')
describe('createGoalFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>

  it('should validate given validators return no errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetCompletionDate: '2024-02-29',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue([])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      title: '',
      targetCompletionDate: '2024-02-29',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })
})
