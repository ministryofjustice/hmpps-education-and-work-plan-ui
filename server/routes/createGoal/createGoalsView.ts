import type { CreateGoalsForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalsForm: CreateGoalsForm,
    private readonly goalTargetCompletionDateOptions: typeof GoalTargetCompletionDateOption,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalsForm
    goalTargetCompletionDateOptions: typeof GoalTargetCompletionDateOption
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalsForm,
      goalTargetCompletionDateOptions: this.goalTargetCompletionDateOptions,
    }
  }
}
