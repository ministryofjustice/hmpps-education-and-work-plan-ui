import type { CreateGoalsForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalsForm: CreateGoalsForm,
    private readonly futureGoalTargetDates: Array<{ text: string; value: string }>,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalsForm
    futureGoalTargetDates: Array<{ text: string; value: string }>
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalsForm,
      futureGoalTargetDates: this.futureGoalTargetDates,
      errors: this.errors || [],
    }
  }
}
