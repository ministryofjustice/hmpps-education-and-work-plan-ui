import type { PrisonerSummary } from 'viewModels'
import { GoalCompleteDateOptions } from './validators/GoalForm'

export default class CreateGoalsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goalCompleteDateOptions: typeof GoalCompleteDateOptions,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    goalCompleteDateOptions: typeof GoalCompleteDateOptions
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      goalCompleteDateOptions: this.goalCompleteDateOptions,
    }
  }
}
