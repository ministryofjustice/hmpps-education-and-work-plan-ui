import type { PageFlow } from 'viewModels'
import type {
  ArchiveGoalForm,
  CreateGoalsForm,
  CompleteGoalForm,
  HighestLevelOfEducationForm,
  QualificationDetailsForm,
  QualificationLevelForm,
  UpdateGoalForm,
} from 'forms'
import type {
  AdditionalTrainingForm,
  AffectAbilityToWorkForm,
  HopingToWorkOnReleaseForm,
  InductionExemptionForm,
  InductionNoteForm,
  InPrisonTrainingForm,
  InPrisonWorkForm,
  PersonalInterestsForm,
  PreviousWorkExperienceDetailForm,
  PreviousWorkExperienceTypesForm,
  SkillsForm,
  WantToAddQualificationsForm,
  WhoCompletedInductionForm,
  WorkedBeforeForm,
  WorkInterestRolesForm,
  WorkInterestTypesForm,
} from 'inductionForms'
import type { ReviewNoteForm, WhoCompletedReviewForm, ReviewExemptionForm } from 'reviewPlanForms'
import type { EducationDto, ReviewPlanDto, ReviewExemptionDto } from 'dto'
import type { InductionDto, InductionExemptionDto } from 'inductionDto'
import type { UserDetails } from '../../services/userService'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerListSortOptions: string
    sessionListSortOptions: string

    prisonerContexts: PrisonerContexts

    pageFlowHistory: PageFlow
    pageFlowQueue: PageFlow
  }
  export interface PrisonerContext {
    // Goal related forms
    createGoalsForm?: CreateGoalsForm
    updateGoalForm?: UpdateGoalForm
    archiveGoalForm?: ArchiveGoalForm
    completeGoalForm?: CompleteGoalForm
    // Education related forms and DTO
    highestLevelOfEducationForm?: HighestLevelOfEducationForm
    qualificationLevelForm?: QualificationLevelForm
    qualificationDetailsForm?: QualificationDetailsForm
    educationDto?: EducationDto
    // Review related forms and DTO
    whoCompletedReviewForm?: WhoCompletedReviewForm
    reviewNoteForm?: ReviewNoteForm
    reviewPlanDto?: ReviewPlanDto
    // Review exemption related forms and DTO
    reviewExemptionForm?: ReviewExemptionForm
    reviewExemptionDto?: ReviewExemptionDto
    // Induction related forms and DTO
    hopingToWorkOnReleaseForm?: HopingToWorkOnReleaseForm
    workInterestTypesForm?: WorkInterestTypesForm
    workInterestRolesForm?: WorkInterestRolesForm
    affectAbilityToWorkForm?: AffectAbilityToWorkForm
    wantToAddQualificationsForm?: WantToAddQualificationsForm
    additionalTrainingForm?: AdditionalTrainingForm
    workedBeforeForm?: WorkedBeforeForm
    previousWorkExperienceTypesForm?: PreviousWorkExperienceTypesForm
    previousWorkExperienceDetailForm?: PreviousWorkExperienceDetailForm
    skillsForm?: SkillsForm
    personalInterestsForm?: PersonalInterestsForm
    inPrisonWorkForm?: InPrisonWorkForm
    inPrisonTrainingForm?: InPrisonTrainingForm
    whoCompletedInductionForm?: WhoCompletedInductionForm
    inductionNoteForm?: InductionNoteForm
    inductionDto?: InductionDto
    // Induction exemption related forms and DTO
    inductionExemptionForm?: InductionExemptionForm
    inductionExemptionDto?: InductionExemptionDto
  }

  export type PrisonerContexts = Record<string, PrisonerContext>
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      username: string
      token: string
      authSource: string
    }

    interface Response {
      redirectWithSuccess?(path: string, message: string): void

      redirectWithErrors?(path: string, message: Record<string, string>[]): void
    }

    interface Request {
      verified?: boolean
      id: string

      logout(done: (err: unknown) => void): void

      flash(type: string, message: Array<Record<string, string>>): number
    }
  }
}
