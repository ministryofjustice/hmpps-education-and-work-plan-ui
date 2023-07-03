import type { AddStepForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class AddStepView {
  constructor(
    private readonly goalTitle: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly addStepForm: AddStepForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    goalTitle: string
    prisonerSummary: PrisonerSummary
    form: AddStepForm
    errors?: Array<Record<string, string>>
  } {
    return {
      goalTitle: this.goalTitle,
      prisonerSummary: this.prisonerSummary,
      form: this.addStepForm,
      errors: this.errors || [],
    }
  }
}
