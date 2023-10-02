import validateTargetDate from './goalTargetCompletionDateValidator'

describe('goalTargetDateValidator', () => {
  it('should validate given no date selection', () => {
    // Given
    const targetCompletionDate = ''
    // When
    const errors = validateTargetDate(targetCompletionDate)

    // Then
    expect(errors).toStrictEqual(['Select a target completion date'])
  })

  it('should validate given empty day', () => {
    // Given
    const day = ''
    const month = '02'
    const year = '2040'
    // When
    const errors = validateTargetDate('another-date', day, month, year)

    // Then
    expect(errors).toStrictEqual(['Enter a valid date'])
  })

  it('should validate given empty month', () => {
    // Given
    const day = '26'
    const month = ''
    const year = '2040'
    // When
    const errors = validateTargetDate('another-date', day, month, year)

    // Then
    expect(errors).toStrictEqual(['Enter a valid date'])
  })

  it('should validate given empty year', () => {
    // Given
    const day = '26'
    const month = '02'
    const year = ''
    // When
    const errors = validateTargetDate('another-date', day, month, year)

    // Then
    expect(errors).toStrictEqual(['Enter a valid date'])
  })

  it('should validate given an invalid date', () => {
    // Given
    const day = '26'
    const month = '40'
    const year = '2024'
    // When
    const errors = validateTargetDate('another-date', day, month, year)

    // Then
    expect(errors).toStrictEqual(['Enter a valid date'])
  })

  it('should validate given a date in the past', () => {
    // Given
    const day = '26'
    const month = '02'
    const year = '2007'
    // When
    const errors = validateTargetDate('another-date', day, month, year)

    // Then
    expect(errors).toStrictEqual(['Enter a date in the future'])
  })
})
