import type { FunctionalSkills, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import type { WantToAddQualificationsForm } from 'inductionForms'

export default class WantToAddQualificationsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly wantToAddQualificationsForm: WantToAddQualificationsForm,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    form: WantToAddQualificationsForm
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      form: this.wantToAddQualificationsForm,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
    }
  }
}
