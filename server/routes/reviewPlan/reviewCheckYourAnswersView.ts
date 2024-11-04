import type { ReviewPlanDto } from 'dto'
import type { PrisonerSummary } from 'viewModels'

export default class ReviewCheckYourAnswersView {
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
