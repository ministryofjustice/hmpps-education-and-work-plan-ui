import type { PrisonerSummary } from 'viewModels'
import type { ActionPlanDto } from 'dto'

export default class OverviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly prisonNumber: string,
    private readonly actionPlan: ActionPlanDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    tab: string
    prisonNumber: string
    actionPlan: ActionPlanDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      tab: 'overview',
      prisonNumber: this.prisonNumber,
      actionPlan: this.actionPlan,
    }
  }
}
