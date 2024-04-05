import type { PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'

export default class CheckYourAnswersView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionDto: InductionDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    inductionDto: InductionDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      inductionDto: this.inductionDto,
    }
  }
}
