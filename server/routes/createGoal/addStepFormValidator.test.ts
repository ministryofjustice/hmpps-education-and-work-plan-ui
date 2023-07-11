import type { AddStepForm } from 'forms'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepTargetDateRange from '../../validators/stepTargetDateRangeValidator'
import validateAddStepForm from './addStepFormValidator'

jest.mock('../../validators/stepTitleValidator')
jest.mock('../../validators/stepTargetDateRangeValidator')
describe('addStepFormValidator', () => {
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>
  const mockedValidateStepTargetDateRange = validateStepTargetDateRange as jest.MockedFunction<
    typeof validateStepTargetDateRange
  >

  it('should validate given no errors', () => {
    // Given
    const form = {
      stepNumber: 1,
      prisonNumber: 'A1234BC',
      title: 'Book Spanish course',
      targetDateRange: 'ZERO_TO_THREE_MONTHS',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue([])

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
      targetDateRange: 'ZERO_TO_THREE_MONTHS',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepTargetDateRange.mockReturnValue([])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })

  it('should validate given step target date range errors', () => {
    // Given
    const form = {
      stepNumber: 1,
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetDateRange: undefined,
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDateRange.mockReturnValue(['a-target-date-range-error'])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetDateRange', text: 'a-target-date-range-error' }])
  })

  it('should validate given multiple create step errors', () => {
    // Given
    const form = {
      stepNumber: 1,
      prisonNumber: 'A1234BC',
      title: undefined,
      targetDateRange: undefined,
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepTargetDateRange.mockReturnValue(['a-target-date-range-error'])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#title', text: 'some-title-error' },
      { href: '#targetDateRange', text: 'a-target-date-range-error' },
    ])
  })
})
