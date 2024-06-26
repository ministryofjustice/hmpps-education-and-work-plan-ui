declare module 'forms' {
  export interface CreateGoalForm {
    prisonNumber: string
    title?: string
    targetCompletionDate?: string
    'targetCompletionDate-day'?: string
    'targetCompletionDate-month'?: string
    'targetCompletionDate-year'?: string
  }

  export interface AddStepForm {
    stepNumber: number
    title?: string
    action?: 'add-another-step' | 'submit-form'
  }

  export interface AddNoteForm {
    note?: string
  }

  export interface ReviewGoalForm {
    action?: 'add-another-goal' | 'submit-form'
  }

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
  }
}

/**
 * Module declaring "composite forms", specifically types that contain other forms.
 * The composite form is not a form object in its own right, in that there are no HTML views, forms or express request
 * handlers that bind request form fields to an object of this type. It is a convenience object to allow collating
 * several form objects into a single object held in the session; typically used in multi-page / wizard style screens.
 */
declare module 'compositeForms' {
  import type { AddNoteForm, AddStepForm, CreateGoalForm } from 'forms'

  /**
   * A composite form representing the individual form objects for creating a new Goal
   */
  export interface NewGoal {
    createGoalForm: CreateGoalForm
    addStepForm: AddStepForm // A single AddStepForm representing the Step that is currently being added
    addStepForms: Array<AddStepForm> // An array of AddStepForm representing the Steps that have been added
    addNoteForm: AddNoteForm
  }
}

declare module 'inductionForms' {
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
    workInterestRoles: Map<WorkInterestTypeValue, string>
    workInterestTypesOther: string
  }

  export interface WantToAddQualificationsForm {
    wantToAddQualifications: YesNoValue
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

  export interface AdditionalTrainingForm {
    additionalTraining: Array<AdditionalTrainingValue>
    additionalTrainingOther?: string
  }
}
