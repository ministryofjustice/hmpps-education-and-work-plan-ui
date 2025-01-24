import type { InductionSchedule, PrisonerSummary } from 'viewModels'
import InductionExemptionReasonValue from '../../../../enums/inductionExemptionReasonValue'

export default class ConfirmExemptionRemovalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly inductionSchedule: InductionSchedule,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    exemptionReason: InductionExemptionReasonValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      exemptionReason: this.inductionSchedule.scheduleStatus,
    }
  }
}
