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
    expect(errors).toStrictEqual(['Please select when they will achieve this by'])
  })

  it('should validate given an empty targetDateRange', () => {
    // Given
    const targetDateRange = ''

    // When
    const errors = validateStepTargetDateRange(targetDateRange)

    expect(errors).toStrictEqual(['Please select when they will achieve this by'])
  })
})
