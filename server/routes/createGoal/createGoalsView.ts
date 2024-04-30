import type { PrisonerSummary } from 'viewModels'
import { CreateGoalsForm } from './validators/GoalForm'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly futureGoalTargetDates: Array<{ text: string; value: string }>,
    private readonly createGoalsForm?: CreateGoalsForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalsForm
    futureGoalTargetDates: Array<{ text: string; value: string }>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      futureGoalTargetDates: this.futureGoalTargetDates,
      form: this.createGoalsForm,
    }
  }
}
