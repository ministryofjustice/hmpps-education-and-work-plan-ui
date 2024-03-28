import type { PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'

export default class CheckYourAnswersView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly inductionDto: InductionDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    inductionDto: InductionDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      inductionDto: this.inductionDto,
    }
  }
}
