import type { CreateGoalsForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalsForm: CreateGoalsForm,
    private readonly goalTargetCompletionDateOptions: typeof GoalTargetCompletionDateOption,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalsForm
    goalTargetCompletionDateOptions: typeof GoalTargetCompletionDateOption
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalsForm,
      goalTargetCompletionDateOptions: this.goalTargetCompletionDateOptions,
      errors: this.errors || [],
    }
  }
}
