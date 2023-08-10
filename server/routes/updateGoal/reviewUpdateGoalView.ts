import type { PrisonerSummary } from 'viewModels'
import type { UpdateGoalForm } from 'forms'

export default class ReviewUpdateGoalView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly updateGoalForm: UpdateGoalForm) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    data: UpdateGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      data: this.updateGoalForm,
    }
  }
}
