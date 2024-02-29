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
    private readonly errors?: Array<Record<string, string>>,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    form: PreviousWorkExperienceDetailForm
    typeOfWorkExperience: TypeOfWorkExperienceValue
    errors?: Array<Record<string, string>>
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      form: this.previousWorkExperienceDetailForm,
      typeOfWorkExperience: this.typeOfWorkExperience,
      errors: this.errors || [],
    }
  }
}
