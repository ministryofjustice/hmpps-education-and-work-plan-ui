import formatErrors from './errorFormatter'

describe('formatErrors', () => {
  it('should format given no errors', () => {
    // Given
    const field = ''
    const errors: Array<string> = []

    // When
    const formattedErrors = formatErrors(field, errors)

    // Then
    expect(formattedErrors).toEqual([])
  })

  it('should format given a field with a single error', () => {
    // Given
    const field = 'field'
    const errors = ['first error']

    // When
    const formattedErrors = formatErrors(field, errors)

    // Then
    expect(formattedErrors).toEqual([{ href: '#field', text: 'first error' }])
  })

  it('should format given a field with multiple errors', () => {
    // Given
    const field = 'field'
    const errors = ['first error', 'second error']

    // When
    const formattedErrors = formatErrors(field, errors)

    // Then
    expect(formattedErrors).toEqual([
      { href: '#field', text: 'first error' },
      { href: '#field', text: 'second error' },
    ])
  })
})
