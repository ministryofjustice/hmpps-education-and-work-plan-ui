import validateTargetDate from './goalTargetDateValidator'

describe('goalTargetDateValidator', () => {
  it('should validate given no date selection', () => {
    // Given
    const targetCompletionDate = ''
    // When
    const errors = validateTargetDate(targetCompletionDate)

    // Then
    expect(errors).toStrictEqual(['Select a target completion date'])
  })
})
