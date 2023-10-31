import type { PrisonerSummary, WorkAndInterests } from 'viewModels'

export default class WorkAndInterestsView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly workAndInterests: WorkAndInterests) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    workAndInterests: WorkAndInterests
    hasAtLeastOneSpecificJobRole: boolean
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
      workAndInterests: this.workAndInterests,
      hasAtLeastOneSpecificJobRole:
        this.workAndInterests.data?.workInterests.longQuestionSetAnswers?.jobs.filter(
          jobInterest => jobInterest.specificJobRole,
        ).length > 0,
    }
  }
}
