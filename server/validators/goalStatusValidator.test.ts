import validateGoalStatus from './goalStatusValidator'

describe('goalStatusValidator', () => {
  ;['ACTIVE', 'COMPLETED', 'ARCHIVED'].forEach(status => {
    it(`should validate given status ${status}`, () => {
      // Given

      // When
      const errors = validateGoalStatus(status)

      // Then
      expect(errors).toStrictEqual([])
    })
  })

  it('should validate given empty status', () => {
    // Given
    const status = ''
    // When
    const errors = validateGoalStatus(status)

    // Then
    expect(errors).toStrictEqual(['Choose a status for the goal'])
  })

  it('should validate given invalid status', () => {
    // Given
    const status = 'NOT_A_VALID_STATUS'
    // When
    const errors = validateGoalStatus(status)

    // Then
    expect(errors).toStrictEqual(['Choose a status for the goal'])
  })
})
