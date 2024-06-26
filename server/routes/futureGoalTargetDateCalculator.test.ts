import { UTCDate } from '@date-fns/utc'
import futureGoalTargetDateCalculator from './futureGoalTargetDateCalculator'

describe('futureGoalTargetDateCalculator', () => {
  it('should return a date 3 months in the future', () => {
    // Given
    const today = new UTCDate('2024-02-26')
    // When
    const actual = futureGoalTargetDateCalculator(today, 3)
    // Then
    expect(actual).toEqual({ value: '2024-05-26', text: 'in 3 months (by 26 May 2024)' })
  })
  it('should return a date 6 months in the future', () => {
    // Given
    const today = new UTCDate('2024-02-26')
    // When
    const actual = futureGoalTargetDateCalculator(today, 6)
    // Then
    expect(actual).toEqual({ value: '2024-08-26', text: 'in 6 months (by 26 August 2024)' })
  })
  it('should return a date 12 months in the future', () => {
    // Given
    const today = new UTCDate('2024-02-26')
    // When
    const actual = futureGoalTargetDateCalculator(today, 12)
    // Then
    expect(actual).toEqual({ value: '2025-02-26', text: 'in 12 months (by 26 February 2025)' })
  })
  it('should return the last day of month, if the day of the month on the original date is greater than the number of days in the final month', () => {
    // Given
    const today = new UTCDate('2023-11-30')
    // When
    const actual = futureGoalTargetDateCalculator(today, 3)
    // Then
    expect(actual).toEqual({ value: '2024-02-29', text: 'in 3 months (by 29 February 2024)' })
  })
})
