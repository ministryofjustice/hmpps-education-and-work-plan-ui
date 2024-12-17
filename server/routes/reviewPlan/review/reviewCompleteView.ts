import type { PrisonerSummary } from 'viewModels'
import type { ReviewPlanDto } from 'dto'

export default class ReviewCompleteView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly reviewPlanDto: ReviewPlanDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    reviewPlanDto: ReviewPlanDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      reviewPlanDto: this.reviewPlanDto,
    }
  }
}
