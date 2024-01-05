import type { PrisonerSummary } from 'viewModels'
import type { UpdateGoalDto } from 'dto'

export default class ReviewUpdateGoalView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly updateGoalDto: UpdateGoalDto,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    data: UpdateGoalDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      data: this.updateGoalDto,
    }
  }
}
