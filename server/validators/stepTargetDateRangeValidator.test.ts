import validateStepTargetDateRange from './stepTargetDateRangeValidator'

describe('stepTargetDateRangeValidator', () => {
  it('should validate given a valid targetDateRange', () => {
    // Given
    const targetDateRange = 'ZERO_TO_THREE_MONTHS'

    // When
    const errors = validateStepTargetDateRange(targetDateRange)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given a missing targetDateRange', () => {
    // Given

    // When
    const errors = validateStepTargetDateRange()

    // Then
    expect(errors).toStrictEqual(['Select a target date range'])
  })

  it('should validate given an empty targetDateRange', () => {
    // Given
    const targetDateRange = ''

    // When
    const errors = validateStepTargetDateRange(targetDateRange)

    expect(errors).toStrictEqual(['Select a target date range'])
  })

  it('should validate given a targetDateRange that is too long', () => {
    // Given
    const targetDateRange = 'A'.repeat(51)

    // When
    const errors = validateStepTargetDateRange(targetDateRange)

    expect(errors).toStrictEqual(['The target date range must be 50 characters or less'])
  })
})
