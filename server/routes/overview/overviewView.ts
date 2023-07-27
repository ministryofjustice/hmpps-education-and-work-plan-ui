import type { FunctionalSkills, PrisonerSummary } from 'viewModels'
import type { ActionPlanDto } from 'dto'
import { mostRecentFunctionalSkills } from './mappers/functionalSkillsMapper'

export default class OverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlan: ActionPlanDto,
    private readonly functionalSkills: FunctionalSkills,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    actionPlan: ActionPlanDto
    functionalSkills: FunctionalSkills
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      actionPlan: this.actionPlan,
      functionalSkills: mostRecentFunctionalSkills(this.functionalSkills),
    }
  }
}
