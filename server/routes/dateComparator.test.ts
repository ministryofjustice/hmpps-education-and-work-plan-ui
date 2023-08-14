import moment from 'moment'
import dateComparator from './dateComparator'

describe('dateComparator', () => {
  it('should determine if 2 dates are equal', () => {
    // Given
    const date1 = moment('2023-08-14').toDate()
    const date2 = moment('2023-08-14').toDate()

    // When
    const actual = dateComparator(date1, date2)

    // Then
    expect(actual).toBe(0)
  })

  it('should determine if a date is before another', () => {
    // Given
    const date1 = moment('2023-08-13').toDate()
    const date2 = moment('2023-08-14').toDate()

    // When
    const actual = dateComparator(date1, date2)

    // Then
    expect(actual).toBe(1)
  })

  it('should determine if a date is after another', () => {
    // Given
    const date1 = moment('2023-08-15').toDate()
    const date2 = moment('2023-08-14').toDate()

    // When
    const actual = dateComparator(date1, date2)

    // Then
    expect(actual).toBe(-1)
  })
})
