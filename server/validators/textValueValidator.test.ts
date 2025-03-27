import textValueExceedsLength from './textValueValidator'

describe('textValueValidator', () => {
  it.each([
    { value: `1234`, maxLength: 5, expected: false },
    { value: `12345`, maxLength: 5, expected: false },
    { value: `123456`, maxLength: 5, expected: true },
    {
      value: `1234
`,
      maxLength: 5,
      expected: false,
    },
    {
      value: `12345
`,
      maxLength: 5,
      expected: true,
    },
  ])('should validate whether text value exceeds length', spec => {
    // Given

    // When
    const actual = textValueExceedsLength(spec.value, spec.maxLength)

    // Then
    expect(actual).toEqual(spec.expected)
  })
})
