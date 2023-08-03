import validateStepTargetDateRange from './stepTargetDateRangeValidator'

describe('stepTargetDateRangeValidator', () => {
  ;['ZERO_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'SIX_TO_TWELVE_MONTHS', 'MORE_THAN_TWELVE_MONTHS'].forEach(
    targetDateRange => {
      it(`should validate given targetDateRange ${targetDateRange}`, () => {
        // Given

        // When
        const errors = validateStepTargetDateRange(targetDateRange)

        // Then
        expect(errors).toStrictEqual([])
      })
    },
  )

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

  it('should validate given invalid targetDateRange', () => {
    // Given
    const targetDateRange = 'NOT_A_VALID_STATUS'
    // When
    const errors = validateStepTargetDateRange(targetDateRange)

    // Then
    expect(errors).toStrictEqual(['Please select when they will achieve this by'])
  })
})
