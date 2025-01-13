declare module 'forms' {
  import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'
  import EducationLevelValue from '../../enums/educationLevelValue'
  import QualificationLevelValue from '../../enums/qualificationLevelValue'

  export interface UpdateGoalForm {
    reference: string
    title?: string
    createdAt: string
    targetCompletionDate?: string
    'targetCompletionDate-day'?: string
    'targetCompletionDate-month'?: string
    'targetCompletionDate-year'?: string
    note?: string
    steps: Array<UpdateStepForm>
    action?: 'add-another-step' | 'submit-form' | 'delete-step-[0]'
    originalTargetCompletionDate: string
  }

  export interface UpdateStepForm {
    reference?: string
    title?: string
    stepNumber: number
    status: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE'
  }

  export interface CreateGoalsForm {
    prisonNumber: string
    goals: Array<{
      title?: string
      targetCompletionDate?: GoalTargetCompletionDateOption
      'targetCompletionDate-day'?: string
      'targetCompletionDate-month'?: string
      'targetCompletionDate-year'?: string
      steps: Array<{
        title?: string
      }>
      note?: string
    }>
  }

  export interface ArchiveGoalForm {
    reference: string
    title: string
    reason?:
      | 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL'
      | 'PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG'
      | 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON'
      | 'OTHER'
    reasonOther?: string
    notes?: string
  }

  export interface UnarchiveGoalForm {
    reference: string
    title: string
  }

  export interface CompleteGoalForm {
    reference: string
    title: string
    notes: string
  }

  export interface CompleteOrArchiveGoalForm {
    reference: string
    title: string
    archiveOrComplete: string
  }

  export interface HighestLevelOfEducationForm {
    educationLevel: EducationLevelValue
  }

  export interface QualificationLevelForm {
    qualificationLevel: QualificationLevelValue
  }

  export interface QualificationDetailsForm {
    qualificationSubject: string
    qualificationGrade: string
  }
}

declare module 'inductionForms' {
  import HopingToGetWorkValue from '../../enums/hopingToGetWorkValue'
  import InPrisonWorkValue from '../../enums/inPrisonWorkValue'
  import InPrisonTrainingValue from '../../enums/inPrisonTrainingValue'
  import SkillsValue from '../../enums/skillsValue'
  import PersonalInterestsValue from '../../enums/personalInterestsValue'
  import HasWorkedBeforeValue from '../../enums/hasWorkedBeforeValue'
  import TypeOfWorkExperienceValue from '../../enums/typeOfWorkExperienceValue'
  import AbilityToWorkValue from '../../enums/abilityToWorkValue'
  import WorkInterestTypeValue from '../../enums/workInterestTypeValue'
  import YesNoValue from '../../enums/yesNoValue'
  import AdditionalTrainingValue from '../../enums/additionalTrainingValue'

  export interface HopingToWorkOnReleaseForm {
    hopingToGetWork: HopingToGetWorkValue
  }

  export interface InPrisonWorkForm {
    inPrisonWork: Array<InPrisonWorkValue>
    inPrisonWorkOther?: string
  }

  export interface InPrisonTrainingForm {
    inPrisonTraining: Array<InPrisonTrainingValue>
    inPrisonTrainingOther?: string
  }

  export interface SkillsForm {
    skills: Array<SkillsValue>
    skillsOther?: string
  }

  export interface PersonalInterestsForm {
    personalInterests: Array<PersonalInterestsValue>
    personalInterestsOther?: string
  }

  export interface WorkedBeforeForm {
    hasWorkedBefore: HasWorkedBeforeValue
    hasWorkedBeforeNotRelevantReason?: string
  }

  export interface PreviousWorkExperienceTypesForm {
    typeOfWorkExperience: Array<TypeOfWorkExperienceValue>
    typeOfWorkExperienceOther?: string
  }

  export interface PreviousWorkExperienceDetailForm {
    jobRole: string
    jobDetails: string
  }

  export interface AffectAbilityToWorkForm {
    affectAbilityToWork: Array<AbilityToWorkValue>
    affectAbilityToWorkOther?: string
  }

  export interface WorkInterestTypesForm {
    workInterestTypes: Array<WorkInterestTypeValue>
    workInterestTypesOther?: string
  }

  export interface WorkInterestRolesForm {
    workInterestRoles: [WorkInterestTypeValue, string][]
    workInterestTypesOther: string
  }

  export interface WantToAddQualificationsForm {
    wantToAddQualifications: YesNoValue
  }

  export interface AdditionalTrainingForm {
    additionalTraining: Array<AdditionalTrainingValue>
    additionalTrainingOther?: string
  }
}

declare module 'reviewPlanForms' {
  import SessionCompletedByValue from '../../enums/sessionCompletedByValue'

  export interface WhoCompletedReviewForm {
    completedBy: SessionCompletedByValue
    completedByOtherFullName?: string
    completedByOtherJobRole?: string
    'reviewDate-day': string
    'reviewDate-month': string
    'reviewDate-year': string
  }

  export interface ReviewNoteForm {
    notes?: string
  }

  export interface ReviewExemptionForm {
    exemptionReason: ReviewPlanExemptionReasonValue
    exemptionReasonDetails: Record<ReviewPlanExemptionReasonValue, string | undefined>
  }
}
