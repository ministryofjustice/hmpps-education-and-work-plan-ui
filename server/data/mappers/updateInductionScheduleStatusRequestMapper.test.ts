import type { UpdateInductionScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import aValidInductionExemptionDto from '../../testsupport/inductionExemptionDtoTestDataBuilder'
import toUpdateInductionScheduleStatusRequest from './updateInductionScheduleStatusRequestMapper'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

describe('updateInductionScheduleStatusRequestMapper', () => {
  it('should map an InductionExemptionDto to an UpdateInductionScheduleStatusRequest', () => {
    // Given
    const inductionExemptionDto = aValidInductionExemptionDto({
      prisonId: 'BXI',
      prisonNumber: 'A1234BC',
      exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
      exemptionReasonDetails: 'Prisoner has mental health issues and is considering self harm today',
    })

    const expected: UpdateInductionScheduleStatusRequest = {
      prisonId: 'BXI',
      status: 'EXEMPT_PRISONER_SAFETY_ISSUES',
      exemptionReason: 'Prisoner has mental health issues and is considering self harm today',
    }

    // When
    const actual = toUpdateInductionScheduleStatusRequest(inductionExemptionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
