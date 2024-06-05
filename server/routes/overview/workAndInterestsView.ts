import type { PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'

export default class WorkAndInterestsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    }
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
      induction: this.induction,
    }
  }
}
