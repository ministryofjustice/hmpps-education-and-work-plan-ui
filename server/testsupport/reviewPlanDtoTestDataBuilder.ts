import { format, startOfDay } from 'date-fns'
import type { ReviewPlanDto } from 'dto'
import ReviewPlanCompletedByValue from '../enums/reviewPlanCompletedByValue'

const aValidReviewPlanDto = (options?: {
  completedBy?: ReviewPlanCompletedByValue
  completedByOther?: string
  reviewDate?: Date
  notes?: string
}): ReviewPlanDto => ({
  completedBy: options?.completedBy || ReviewPlanCompletedByValue.MYSELF,
  completedByOther: options?.completedByOther,
  reviewDate: options?.reviewDate ? format(startOfDay(options.reviewDate), 'yyyy-MM-dd') : '2024-10-01',
  notes: options?.notes || 'Chris is making good progress on his goals',
})

export default aValidReviewPlanDto
