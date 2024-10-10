import type { PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'

export default class SupportNeedsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly supportNeeds: PrisonerSupportNeeds,
    private readonly atLeastOnePrisonHasSupportNeeds: boolean,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    supportNeeds: PrisonerSupportNeeds
    atLeastOnePrisonHasSupportNeeds: boolean
  } {
    return {
      tab: 'support-needs',
      prisonerSummary: this.prisonerSummary,
      supportNeeds: this.supportNeeds,
      atLeastOnePrisonHasSupportNeeds: this.atLeastOnePrisonHasSupportNeeds,
    }
  }
}
