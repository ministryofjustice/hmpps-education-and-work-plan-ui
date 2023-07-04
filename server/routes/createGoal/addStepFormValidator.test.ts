import type { AddStepForm } from 'forms'
import moment from 'moment'
import validateStepTitle from '../../validators/stepTitleValidator'
import validateStepTargetDate from '../../validators/stepTargetDateValidator'
import validateAddStepForm from './addStepFormValidator'

jest.mock('../../validators/stepTitleValidator')
jest.mock('../../validators/stepTargetDateValidator')
describe('addStepFormValidator', () => {
  const mockedValidateStepTitle = validateStepTitle as jest.MockedFunction<typeof validateStepTitle>
  const mockedValidateStepTargetDate = validateStepTargetDate as jest.MockedFunction<typeof validateStepTargetDate>

  it('should validate given no errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Book Spanish course',
      targetDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      'targetDate-day': '31',
      'targetDate-month': '06',
      'targetDate-year': '2123',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDate.mockReturnValue([])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given step title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      title: '',
      targetDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      'targetDate-day': '31',
      'targetDate-month': '06',
      'targetDate-year': '2123',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepTargetDate.mockReturnValue([])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })

  it('should validate given step target date errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      targetDate: moment('2122-06-01', 'YYYY-MM-DD').toDate(), // date in the past
      'targetDate-day': '01',
      'targetDate-month': '06',
      'targetDate-year': '2123',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue([])
    mockedValidateStepTargetDate.mockReturnValue(['a-target-date-error'])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([{ href: '#targetDate-day', text: 'a-target-date-error' }])
  })

  it('should validate given multiple create step errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: undefined,
      targetDate: moment('2122-06-01', 'YYYY-MM-DD').toDate(), // date in the past
      'targetDate-day': '01',
      'targetDate-month': '06',
      'targetDate-year': '2123',
    } as AddStepForm

    mockedValidateStepTitle.mockReturnValue(['some-title-error'])
    mockedValidateStepTargetDate.mockReturnValue(['a-target-date-error'])

    // When
    const errors = validateAddStepForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#title', text: 'some-title-error' },
      { href: '#targetDate-day', text: 'a-target-date-error' },
    ])
  })
})
