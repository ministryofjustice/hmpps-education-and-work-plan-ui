import type { PrisonerSummary } from 'viewModels'

export default class ExemptionRecordedView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly exemptionDueToTechnicalIssue: boolean,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    exemptionDueToTechnicalIssue: boolean
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      exemptionDueToTechnicalIssue: this.exemptionDueToTechnicalIssue,
    }
  }
}
