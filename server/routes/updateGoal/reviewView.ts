import type { PrisonerSummary } from 'viewModels'
import type { UpdateGoalForm } from 'forms'

export default class ReviewView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly updateGoalDto: UpdateGoalForm) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    data: UpdateGoalForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      data: this.updateGoalDto,
    }
  }
}
