import type { PageFlow, PrisonerSummary } from 'viewModels'
import type { ArchiveGoalForm, CreateGoalsForm, UpdateGoalForm } from 'forms'
import type {
  AdditionalTrainingForm,
  AffectAbilityToWorkForm,
  HighestLevelOfEducationForm,
  HopingToWorkOnReleaseForm,
  InPrisonTrainingForm,
  InPrisonWorkForm,
  PersonalInterestsForm,
  PreviousWorkExperienceDetailForm,
  PreviousWorkExperienceTypesForm,
  QualificationDetailsForm,
  QualificationLevelForm,
  SkillsForm,
  WantToAddQualificationsForm,
  WorkedBeforeForm,
  WorkInterestTypesForm,
} from 'inductionForms'
import type { InductionDto } from 'inductionDto'
import type { UserDetails } from '../../services/userService'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    prisonerListSortOptions: string

    prisonerSummary: PrisonerSummary
    createGoalsForm: CreateGoalsForm
    updateGoalForm: UpdateGoalForm
    archiveGoalForm: ArchiveGoalForm
    pageFlowHistory: PageFlow
    pageFlowQueue: PageFlow
    // Induction related objects held on the session
    inductionDto: InductionDto
    hopingToWorkOnReleaseForm: HopingToWorkOnReleaseForm
    inPrisonWorkForm: InPrisonWorkForm
    inPrisonTrainingForm: InPrisonTrainingForm
    skillsForm: SkillsForm
    personalInterestsForm: PersonalInterestsForm
    workedBeforeForm: WorkedBeforeForm
    previousWorkExperienceTypesForm: PreviousWorkExperienceTypesForm
    previousWorkExperienceDetailForm: PreviousWorkExperienceDetailForm
    affectAbilityToWorkForm: AffectAbilityToWorkForm
    workInterestTypesForm: WorkInterestTypesForm
    wantToAddQualificationsForm: WantToAddQualificationsForm
    highestLevelOfEducationForm: HighestLevelOfEducationForm
    qualificationLevelForm: QualificationLevelForm
    qualificationDetailsForm: QualificationDetailsForm
    additionalTrainingForm: AdditionalTrainingForm
    prisonerContexts: PrisonerContexts
  }
  export interface PrisonerContext {
    updateGoalForm?: UpdateGoalForm
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
