import type { PrisonerSummary } from 'viewModels'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly tab: string,
    private readonly prisonNumber: string,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    prisonNumber: string
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: this.tab,
      prisonNumber: this.prisonNumber,
    }
  }
}
