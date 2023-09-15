import fallbackMessageFilter from './fallbackMessageFilter'

describe('fallbackMessageFilter', () => {
  it('should return value given value', () => {
    // Given
    const value = 'some value'
    const fallBackValue = 'some alternative fallback value'

    // When
    const actual = fallbackMessageFilter(value, fallBackValue)

    // Then
    expect(actual).toEqual(value)
  })

  Array.of(undefined, null, '', '    ').forEach(value => {
    it(`should return fallback value given '${value}'`, () => {
      // Given
      const fallBackValue = 'some alternative fallback value'

      // When
      const actual = fallbackMessageFilter(value, fallBackValue)

      // Then
      expect(actual).toEqual(fallBackValue)
    })
  })
})
