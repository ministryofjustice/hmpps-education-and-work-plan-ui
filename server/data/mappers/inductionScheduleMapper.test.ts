import toInductionSchedule from './inductionScheduleMapper'
import aValidInductionScheduleResponse from '../../testsupport/inductionScheduleResponseTestDataBuilder'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'

describe('inductionScheduleMapper', () => {
  it('should map an InductionScheduleResponse to an InductionSchedule view model object', () => {
    // Given
    const inductionScheduleResponse = aValidInductionScheduleResponse()
    const expectedInductionSchedule = aValidInductionSchedule()

    // When
    const actual = toInductionSchedule(inductionScheduleResponse)

    // Then
    expect(actual).toEqual(expectedInductionSchedule)
  })
})
