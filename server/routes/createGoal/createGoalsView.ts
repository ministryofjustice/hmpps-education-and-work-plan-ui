import type { CreateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalForm: CreateGoalForm,
    private readonly futureGoalTargetDates: Array<{ text: string; value: string }>,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalForm
    futureGoalTargetDates: Array<{ text: string; value: string }>
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalForm,
      futureGoalTargetDates: this.futureGoalTargetDates,
      errors: this.errors || [],
    }
  }
}
