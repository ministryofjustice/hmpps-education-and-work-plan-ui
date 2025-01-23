import type { InductionSchedule, PrisonerSummary } from 'viewModels'

export default class ExemptionRecordedView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionSchedule: InductionSchedule,
    private readonly exemptionDueToTechnicalIssue: boolean,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    inductionDueDate: Date
    exemptionDueToTechnicalIssue: boolean
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      inductionDueDate: this.inductionSchedule.deadlineDate,
      exemptionDueToTechnicalIssue: this.exemptionDueToTechnicalIssue,
    }
  }
}
