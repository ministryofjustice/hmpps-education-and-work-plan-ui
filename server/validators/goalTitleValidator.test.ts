import validateGoalTitle from './goalTitleValidator'

describe('goalTitleValidator', () => {
  it('should validate given a valid goal title', () => {
    // Given
    const title = 'Learn Spanish'

    // When
    const errors = validateGoalTitle(title)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given a missing title', () => {
    // Given

    // When
    const errors = validateGoalTitle()

    // Then
    expect(errors).toStrictEqual(['Enter the goal description'])
  })

  it('should validate given an empty goal title', () => {
    // Given
    const title = ''

    // When
    const errors = validateGoalTitle(title)

    expect(errors).toStrictEqual(['Enter the goal description'])
  })

  it('should validate given a title that is too long', () => {
    // Given
    const title = 'A'.repeat(513)

    // When
    const errors = validateGoalTitle(title)

    expect(errors).toStrictEqual(['The goal description must be 512 characters or less'])
  })
})
