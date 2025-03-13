import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

export default class PreviousWorkExperienceDetailView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
    private readonly typeOfWorkExperience: TypeOfWorkExperienceValue,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: PreviousWorkExperienceDetailForm
    typeOfWorkExperience: TypeOfWorkExperienceValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.previousWorkExperienceDetailForm,
      typeOfWorkExperience: this.typeOfWorkExperience,
    }
  }
}
