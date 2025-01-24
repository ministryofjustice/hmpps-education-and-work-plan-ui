import type { InductionSchedule, PrisonerSummary } from 'viewModels'

export default class ExemptionRemovedView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionSchedule: InductionSchedule,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    inductionDueDate: Date
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      inductionDueDate: this.inductionSchedule.deadlineDate,
    }
  }
}
