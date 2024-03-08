import type { PrisonerSummary } from 'viewModels'

export default class InPrisonCoursesAndQualificationsView {
  constructor(private readonly prisonerSummary: PrisonerSummary) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
  } {
    return {
      prisonerSummary: this.prisonerSummary,
    }
  }
}
