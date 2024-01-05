import type { PrisonerSummary, WorkAndInterests } from 'viewModels'

export default class WorkAndInterestsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly workAndInterests: WorkAndInterests,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    workAndInterests: WorkAndInterests
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
      workAndInterests: this.workAndInterests,
    }
  }
}
