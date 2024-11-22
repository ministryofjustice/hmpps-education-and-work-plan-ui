import { parseISO } from 'date-fns'
import type { CreateActionPlanReviewRequest } from 'educationAndWorkPlanApiClient'
import aValidReviewPlanDto from '../../testsupport/reviewPlanDtoTestDataBuilder'
import toCreateActionPlanReviewRequest from './createActionPlanReviewRequestMapper'
import ReviewPlanCompletedByValue from '../../enums/reviewPlanCompletedByValue'

describe('createActionPlanReviewRequestMapper', () => {
  it('should map a ReviewPlanDto to a CreateActionPlanReviewRequest', () => {
    // Given
    const reviewPlanDto = aValidReviewPlanDto({
      prisonId: 'BXI',
      reviewDate: parseISO('2024-10-15'),
      notes: 'Chris is making good progress on his goals',
      completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
      completedByOtherFullName: 'Bobby Button',
      completedByOtherJobRole: 'Peer mentor',
    })

    const expected: CreateActionPlanReviewRequest = {
      conductedAt: '2024-10-15',
      conductedBy: 'Bobby Button',
      conductedByRole: 'Peer mentor',
      note: 'Chris is making good progress on his goals',
      prisonId: 'BXI',
    }

    // When
    const actual = toCreateActionPlanReviewRequest(reviewPlanDto)

    // Then
    expect(actual).toEqual(expected)
  })
})
