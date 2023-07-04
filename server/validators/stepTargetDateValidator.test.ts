import moment from 'moment'
import validateStepTargetDate from './stepTargetDateValidator'

describe('stepTargetDateValidator', () => {
  it('should validate given a valid step target date', () => {
    // Given
    const targetDate = moment().add(6, 'months').toDate()

    // When
    const errors = validateStepTargetDate(targetDate)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given a missing target date', () => {
    // Given

    // When
    const errors = validateStepTargetDate()

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given an invalid target date', () => {
    // Given
    const targetDate = new Date(NaN)

    // When
    const errors = validateStepTargetDate(targetDate)

    expect(errors).toStrictEqual(['Enter a target date in the correct format'])
  })

  it('should validate given a target date in the past', () => {
    // Given
    const targetDate = moment().subtract(1, 'day').toDate()

    // When
    const errors = validateStepTargetDate(targetDate)

    expect(errors).toStrictEqual(['Enter a target date in the future'])
  })
})
