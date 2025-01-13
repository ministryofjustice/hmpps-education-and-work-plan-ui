import { format } from 'date-fns'
import type { CreateActionPlanReviewRequest } from 'educationAndWorkPlanApiClient'
import type { ReviewPlanDto } from 'dto'
import SessionCompletedByValue from '../../enums/sessionCompletedByValue'

const toCreateActionPlanReviewRequest = (reviewPlanDto: ReviewPlanDto): CreateActionPlanReviewRequest => ({
  prisonId: reviewPlanDto.prisonId,
  note: reviewPlanDto.notes,
  conductedAt: format(reviewPlanDto.reviewDate, 'yyyy-MM-dd'),
  conductedBy:
    reviewPlanDto.completedBy === SessionCompletedByValue.SOMEBODY_ELSE
      ? reviewPlanDto.completedByOtherFullName
      : undefined,
  conductedByRole:
    reviewPlanDto.completedBy === SessionCompletedByValue.SOMEBODY_ELSE
      ? reviewPlanDto.completedByOtherJobRole
      : undefined,
})

export default toCreateActionPlanReviewRequest
