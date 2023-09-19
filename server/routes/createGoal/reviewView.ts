import type { PrisonerSummary } from 'viewModels'
import type { CreateGoalDto } from 'dto'

export default class ReviewView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly createGoalDtos: Array<CreateGoalDto>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    goals: Array<CreateGoalDto>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      goals: this.createGoalDtos,
    }
  }
}
