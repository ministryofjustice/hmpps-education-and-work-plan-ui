import type { PrisonerSummary } from 'viewModels'

export default class WorkAndInterestsView {
  constructor(private readonly prisonerSummary: PrisonerSummary) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
    }
  }
}
