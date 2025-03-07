import type { PrisonerSummary } from 'viewModels'
import type { SkillsForm } from 'inductionForms'

export default class SkillsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly skillsForm: SkillsForm,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: SkillsForm
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.skillsForm,
    }
  }
}
