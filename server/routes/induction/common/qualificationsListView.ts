import type { FunctionalSkills, PrisonerSummary } from 'viewModels'
import type { AchievedQualificationDto } from 'inductionDto'

export default class QualificationsListView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly backLinkUrl: string,
    private readonly backLinkAriaText: string,
    private readonly qualifications: Array<AchievedQualificationDto>,
    private readonly functionalSkills: FunctionalSkills,
  ) {}

  get renderArgs(): {
    prisonerSummary: PrisonerSummary
    backLinkUrl: string
    backLinkAriaText: string
    qualifications: Array<AchievedQualificationDto>
    functionalSkills: FunctionalSkills
  } {
    return {
      prisonerSummary: this.prisonerSummary,
      backLinkUrl: this.backLinkUrl,
      backLinkAriaText: this.backLinkAriaText,
      qualifications: this.qualifications,
      functionalSkills: this.functionalSkills,
    }
  }
}
