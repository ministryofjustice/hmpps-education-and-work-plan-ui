import type { PrisonerSummary } from 'viewModels'

export default class ReviewCompleteView {
  constructor(private readonly prisonerSummary: PrisonerSummary) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
  } {
    return {
      prisonerSummary: this.prisonerSummary,
    }
  }
}
