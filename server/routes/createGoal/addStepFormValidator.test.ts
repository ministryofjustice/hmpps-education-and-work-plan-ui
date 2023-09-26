import type { AddStepForm } from 'forms'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateAddStepForm from './addStepFormValidator'

jest.mock('../../validators/stepTitleValidator')
describe('addStepFormValidator', () => {
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>

  it('should validate given no errors', () => {
    // Given
    const form = {
      stepNumber: 1,
      prisonNumber: 'A1234BC',
      title: 'Book Spanish course',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue([])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given step title errors', () => {
    const form = {
      stepNumber: 1,
      prisonNumber: 'A1234BC',
      title: '',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue(['some-title-error'])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })
})
