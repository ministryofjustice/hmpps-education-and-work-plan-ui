import type { CreateGoalForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class CreateGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalForm: CreateGoalForm,
    private readonly currentDatePlus3Months: Date,
    private readonly currentDatePlus6Months: Date,
    private readonly currentDatePlus12Months: Date,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: CreateGoalForm
    currentDatePlus3Months: Date
    currentDatePlus6Months: Date
    currentDatePlus12Months: Date
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.createGoalForm,
      currentDatePlus3Months: this.currentDatePlus3Months,
      currentDatePlus6Months: this.currentDatePlus6Months,
      currentDatePlus12Months: this.currentDatePlus12Months,
      errors: this.errors || [],
    }
  }
}
