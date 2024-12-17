import type { ReviewExemptionDto } from 'dto'
import type { PrisonerSummary } from 'viewModels'

export default class ConfirmExemptionView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly reviewExemptionDto: ReviewExemptionDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    reviewExemptionDto: ReviewExemptionDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      reviewExemptionDto: this.reviewExemptionDto,
    }
  }
}
