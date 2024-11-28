import { startOfDay } from 'date-fns'
import type { ReviewPlanDto } from 'dto'
import ReviewPlanCompletedByValue from '../enums/reviewPlanCompletedByValue'

const aValidReviewPlanDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  completedBy?: ReviewPlanCompletedByValue
  completedByOtherFullName?: string
  completedByOtherJobRole?: string
  reviewDate?: Date
  notes?: string
  wasLastReviewBeforeRelease?: boolean
  nextReviewDateFrom?: Date
  nextReviewDateTo?: Date
}): ReviewPlanDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  completedBy: options?.completedBy || ReviewPlanCompletedByValue.MYSELF,
  completedByOtherFullName: options?.completedByOtherFullName,
  completedByOtherJobRole: options?.completedByOtherJobRole,
  reviewDate: options?.reviewDate ? startOfDay(options.reviewDate) : startOfDay('2024-10-01'),
  notes: options?.notes || 'Chris is making good progress on his goals',
  wasLastReviewBeforeRelease:
    !options || options.wasLastReviewBeforeRelease === null || options.wasLastReviewBeforeRelease === undefined
      ? undefined
      : options.wasLastReviewBeforeRelease,
  nextReviewDateFrom: options?.nextReviewDateFrom,
  nextReviewDateTo: options?.nextReviewDateTo,
})

export default aValidReviewPlanDto
