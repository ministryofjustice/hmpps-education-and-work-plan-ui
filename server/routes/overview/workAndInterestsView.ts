import type { PrisonerSummary, WorkAndInterests, WorkInterests } from 'viewModels'

export default class WorkAndInterestsView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly workAndInterests: WorkAndInterests) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    workAndInterests: WorkInterests
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
      workAndInterests: this.workAndInterests,
    }
  }
}
