import type { PrisonerSummary } from 'viewModels'
import type { PreviousWorkExperienceDetailForm } from 'inductionForms'
import TypeOfWorkExperienceValue from '../../../enums/typeOfWorkExperienceValue'

export default class PreviousWorkExperienceDetailView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm,
    private readonly typeOfWorkExperience: TypeOfWorkExperienceValue,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PreviousWorkExperienceDetailForm
    typeOfWorkExperience: TypeOfWorkExperienceValue
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.previousWorkExperienceDetailForm,
      typeOfWorkExperience: this.typeOfWorkExperience,
    }
  }
}
