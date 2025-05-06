import validateTargetDate from './goalTargetCompletionDateValidator'

describe('goalTargetDateValidator', () => {
  Array.of(
    { day: undefined, month: undefined, year: undefined },
    { day: '26', month: '4', year: '24' },
    { day: '26', month: '40', year: '2024' },
    { day: '', month: '02', year: '2040' },
    { day: '26', month: '', year: '2040' },
    { day: '26', month: '02', year: '' },
    { day: '][', month: '8', year: '2025' },
    { day: '2nd', month: '8', year: '2025' },
    { day: '2', month: 'AUG', year: '2025' },
    { day: 'X', month: 'X11', year: 'MMXXV' },
  ).forEach(dateValues => {
    it(`should validate given an invalid date - day: ${dateValues.day}, month: ${dateValues.month}, year: ${dateValues.year}`, () => {
      // Given

      // When
      const errors = validateTargetDate(`${dateValues.day}/${dateValues.month}/${dateValues.year}`)

      // Then
      expect(errors).toStrictEqual(['Enter a valid date for when they are aiming to achieve this goal by'])
    })
  })

  it('should validate given a date in the past', () => {
    // Given

    // When
    const errors = validateTargetDate('26/2/2007')

    // Then
    expect(errors).toStrictEqual(['Enter a valid date. Date must be in the future'])
  })
})
