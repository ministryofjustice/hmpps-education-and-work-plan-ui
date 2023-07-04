import moment from 'moment'
import validateGoalReviewDate from './goalReviewDateValidator'

describe('goalReviewDateValidator', () => {
  it('should validate given a valid goal review date', () => {
    // Given
    const reviewDate = moment().add(6, 'months').toDate()

    // When
    const errors = validateGoalReviewDate(reviewDate)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given a missing review date', () => {
    // Given

    // When
    const errors = validateGoalReviewDate()

    // Then
    expect(errors).toStrictEqual(['Enter a review date for the goal'])
  })

  it('should validate given an invalid review date', () => {
    // Given
    const reviewDate = new Date(NaN)

    // When
    const errors = validateGoalReviewDate(reviewDate)

    expect(errors).toStrictEqual(['Enter a review date in the correct format'])
  })

  it('should validate given a review date in the past', () => {
    // Given
    const reviewDate = moment().subtract(1, 'day').toDate()

    // When
    const errors = validateGoalReviewDate(reviewDate)

    expect(errors).toStrictEqual(['Enter a review date in the future'])
  })
})
