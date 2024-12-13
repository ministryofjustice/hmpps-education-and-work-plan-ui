import type { UpdateReviewScheduleStatusRequest } from 'educationAndWorkPlanApiClient'
import aValidReviewExemptionDto from '../../testsupport/reviewExemptionDtoTestDataBuilder'
import toUpdateReviewScheduleStatusRequest from './updateReviewScheduleStatusRequestMapper'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'

describe('updateReviewScheduleStatusRequestMapper', () => {
  it('should map a ReviewExemptionDto to an UpdateReviewScheduleStatusRequest', () => {
    // Given
    const reviewExemptionDto = aValidReviewExemptionDto({
      prisonId: 'BXI',
      prisonNumber: 'A1234BC',
      exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_SAFETY_ISSUES,
      exemptionReasonDetails: 'Prisoner has mental health issues and is considering self harm today',
    })

    const expected: UpdateReviewScheduleStatusRequest = {
      prisonId: 'BXI',
      status: 'EXEMPT_PRISONER_SAFETY_ISSUES',
      exemptionReason: 'Prisoner has mental health issues and is considering self harm today',
    }

    // When
    const actual = toUpdateReviewScheduleStatusRequest(reviewExemptionDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
