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

    pageFlowHistory: PageFlow
    pageFlowQueue: PageFlow

    // Induction related forms held on the session
    inPrisonWorkForm: InPrisonWorkForm
    inPrisonTrainingForm: InPrisonTrainingForm
    skillsForm: SkillsForm
    personalInterestsForm: PersonalInterestsForm
    workedBeforeForm: WorkedBeforeForm
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm
    previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm
    affectAbilityToWorkForm: AffectAbilityToWorkForm
    workInterestRolesForm: WorkInterestRolesForm
    workInterestTypesForm: WorkInterestTypesForm
    wantToAddQualificationsForm: WantToAddQualificationsForm
    highestLevelOfEducationForm: HighestLevelOfEducationForm
    qualificationLevelForm: QualificationLevelForm
    qualificationDetailsForm: QualificationDetailsForm
    additionalTrainingForm: AdditionalTrainingForm
    prisonerContexts: PrisonerContexts
  }
  export interface PrisonerContext {
    // Goal related forms
    updateGoalForm?: UpdateGoalForm
    archiveGoalForm?: ArchiveGoalForm
    completeGoalForm?: CompleteGoalForm
    // Education related forms
    highestLevelOfEducationForm?: HighestLevelOfEducationForm
    qualificationLevelForm?: QualificationLevelForm
    qualificationDetailsForm?: QualificationDetailsForm
    // Review related forms
    whoCompletedReviewForm?: WhoCompletedReviewForm
    reviewNoteForm?: ReviewNoteForm
    // Review exemption related forms
    reviewExemptionForm?: ReviewExemptionForm
    // Induction related forms
    whoCompletedInductionForm?: WhoCompletedInductionForm
    inductionNoteForm?: InductionNoteForm
    // Induction exemption related forms
    inductionExemptionForm?: InductionExemptionForm
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

    interface JourneyData {
      inductionDto?: InductionDto
      inductionExemptionDto?: InductionExemptionDto
      reviewPlanDto?: ReviewPlanDto
      reviewExemptionDto?: ReviewExemptionDto
      createGoalsForm?: CreateGoalsForm
      educationDto?: EducationDto
    }

    interface Response {
      redirectWithSuccess?(path: string, message: string): void

      redirectWithErrors?(path: string, message: Record<string, string>[]): void
    }

    interface Request {
      verified?: boolean
      id: string
      journeyData: JourneyData

      logout(done: (err: unknown) => void): void

      flash(type: string, message: Array<Record<string, string>>): number
    }
  }
}
