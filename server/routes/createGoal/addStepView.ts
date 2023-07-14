import type { AddStepForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class AddStepView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly addStepForm: AddStepForm,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: AddStepForm
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.addStepForm,
      errors: this.errors || [],
    }
  }
}
