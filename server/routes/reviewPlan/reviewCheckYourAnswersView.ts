import type { ReviewPlanDto } from 'dto'
import type { PrisonerSummary } from 'viewModels'

export default class ReviewCheckYourAnswersView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly reviewPlanDto: ReviewPlanDto,
    private readonly userName: string,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    reviewPlanDto: ReviewPlanDto
    userName: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      reviewPlanDto: this.reviewPlanDto,
      userName: this.userName,
    }
  }
}
