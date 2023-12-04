import type { AddStepForm } from 'forms'
import type { PrisonerSummary } from 'viewModels'

export default class AddStepView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly addStepForm: AddStepForm,
    private readonly isEditMode: boolean,
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: AddStepForm
    isEditMode: boolean
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.addStepForm,
      isEditMode: this.isEditMode,
      errors: this.errors || [],
    }
  }
}
