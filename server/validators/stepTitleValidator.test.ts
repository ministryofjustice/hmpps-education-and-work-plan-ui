import validateStepTitle from './stepTitleValidator'

describe('stepTitleValidator', () => {
  it('should validate given a valid step title', () => {
    // Given
    const title = 'Book Spanish course'

    // When
    const errors = validateStepTitle(title)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given a missing title', () => {
    // Given

    // When
    const errors = validateStepTitle()

    // Then
    expect(errors).toStrictEqual(['Enter the step title'])
  })

  it('should validate given an empty step title', () => {
    // Given
    const title = ''

    // When
    const errors = validateStepTitle(title)

    expect(errors).toStrictEqual(['Enter the step title'])
  })

  it('should validate given a title that is too long', () => {
    // Given
    const title = 'A'.repeat(513)

    // When
    const errors = validateStepTitle(title)

    expect(errors).toStrictEqual(['Step title must be 512 characters or less'])
  })
})
