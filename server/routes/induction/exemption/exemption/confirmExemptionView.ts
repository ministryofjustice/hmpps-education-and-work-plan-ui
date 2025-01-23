import type { InductionExemptionDto } from 'inductionDto'
import type { PrisonerSummary } from 'viewModels'

export default class ConfirmExemptionView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionExemptionDto: InductionExemptionDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    inductionExemptionDto: InductionExemptionDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      inductionExemptionDto: this.inductionExemptionDto,
    }
  }
}
