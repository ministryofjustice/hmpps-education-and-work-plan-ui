import type { CreateGoalForm } from 'forms'
import moment from 'moment'
import validateGoalTitle from '../../validators/goalTitleValidator'
import validateGoalReviewDate from '../../validators/goalReviewDateValidator'
import validateCreateGoalForm from './createGoalFormValidator'

jest.mock('../../validators/goalTitleValidator')
jest.mock('../../validators/goalReviewDateValidator')
describe('createGoalFormValidator', () => {
  const mockedValidateGoalTitle = validateGoalTitle as jest.MockedFunction<typeof validateGoalTitle>
  const mockedValidateGoalReviewDate = validateGoalReviewDate as jest.MockedFunction<typeof validateGoalReviewDate>

  it('should validate given validators return no errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      reviewDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      'reviewDate-day': '31',
      'reviewDate-month': '06',
      'reviewDate-year': '2123',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalReviewDate.mockReturnValue([])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([])
  })

  it('should validate given goal title errors', () => {
    const form = {
      prisonNumber: 'A1234BC',
      title: '',
      reviewDate: moment('2123-06-31', 'YYYY-MM-DD').toDate(),
      'reviewDate-day': '31',
      'reviewDate-month': '06',
      'reviewDate-year': '2123',
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateGoalReviewDate.mockReturnValue([])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#title', text: 'some-title-error' }])
  })

  it('should validate given goal review date errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: 'Learn Spanish',
      reviewDate: undefined,
      'reviewDate-day': undefined,
      'reviewDate-month': undefined,
      'reviewDate-year': undefined,
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue([])
    mockedValidateGoalReviewDate.mockReturnValue(['a-review-date-error'])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([{ href: '#reviewDate-day', text: 'a-review-date-error' }])
  })

  it('should validate given multiple create goal errors', () => {
    // Given
    const form = {
      prisonNumber: 'A1234BC',
      title: undefined,
      reviewDate: undefined,
      'reviewDate-day': undefined,
      'reviewDate-month': undefined,
      'reviewDate-year': undefined,
    } as CreateGoalForm

    mockedValidateGoalTitle.mockReturnValue(['some-title-error'])
    mockedValidateGoalReviewDate.mockReturnValue(['a-review-date-error'])

    // When
    const errors = validateCreateGoalForm(form)

    // Then
    expect(errors).toEqual([
      { href: '#title', text: 'some-title-error' },
      { href: '#reviewDate-day', text: 'a-review-date-error' },
    ])
  })
})
