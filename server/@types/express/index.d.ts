import type { PageFlow, PrisonerSummary, PrisonerSupportNeeds } from 'viewModels'
import type { ArchiveGoalForm, UpdateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'
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
    prisonerSummary: PrisonerSummary
    supportNeeds: PrisonerSupportNeeds
    newGoal: NewGoal // A single NewGoal representing the Goal that is currently being added
    newGoals: Array<NewGoal> // An array of NewGoal representing the Goals that have been added
    createGoalsForm: CreateGoalsForm
    updateGoalForm: UpdateGoalForm
    archiveGoalForm: ArchiveGoalForm
    prisonerListSortOptions: string
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
  }
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
