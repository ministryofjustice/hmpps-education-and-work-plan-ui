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

  Array.of(
    { day: undefined, month: undefined, year: undefined },
    { day: '26', month: '40', year: '2024' },
    { day: '', month: '02', year: '2040' },
    { day: '26', month: '', year: '2040' },
    { day: '26', month: '02', year: '' },
    { day: '26', month: '40', year: '2024' },
    { day: '][', month: '8', year: '2025' },
    { day: '2nd', month: '8', year: '2025' },
    { day: '2', month: 'AUG', year: '2025' },
    { day: 'X', month: 'X11', year: 'MMXXV' },
  ).forEach(dateValues => {
    it(`should validate given an invalid date - day: ${dateValues.day}, month: ${dateValues.month}, year: ${dateValues.year}`, () => {
      // Given

      // When
      const errors = validateTargetDate('another-date', dateValues.day, dateValues.month, dateValues.year)

      // Then
      expect(errors).toStrictEqual(['Enter a valid date'])
    })
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
