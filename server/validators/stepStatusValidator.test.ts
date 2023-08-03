import validateStepStatus from './stepStatusValidator'

describe('StepStatusValidator', () => {
  ;['NOT_STARTED', 'ACTIVE', 'COMPLETE'].forEach(status => {
    it(`should validate given status ${status}`, () => {
      // Given

      // When
      const errors = validateStepStatus(status)

      // Then
      expect(errors).toStrictEqual([])
    })
  })

  it('should validate given empty status', () => {
    // Given
    const status = ''
    // When
    const errors = validateStepStatus(status)

    // Then
    expect(errors).toStrictEqual(['Choose a status for the step'])
  })

  it('should validate given invalid status', () => {
    // Given
    const status = 'NOT_A_VALID_STATUS'
    // When
    const errors = validateStepStatus(status)

    // Then
    expect(errors).toStrictEqual(['Choose a status for the step'])
  })
})
