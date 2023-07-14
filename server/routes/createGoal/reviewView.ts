import type { PrisonerSummary } from 'viewModels'
import type { CreateGoalDto } from 'dto'

export default class ReviewView {
  constructor(private readonly prisonerSummary: PrisonerSummary, private readonly createGoalDto: CreateGoalDto) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    data: CreateGoalDto
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      data: this.createGoalDto,
    }
  }
}
