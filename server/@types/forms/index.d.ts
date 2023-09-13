declare module 'forms' {
  export interface CreateGoalForm {
    prisonNumber: string
    title?: string
  }

  export interface AddStepForm {
    stepNumber: number
    title?: string
    targetDateRange?: string
    action?: 'add-another-step' | 'submit-form'
  }

  export interface AddNoteForm {
    note?: string
  }

  export interface UpdateGoalForm {
    reference: string
    title?: string
    reviewDate?: string
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
    note?: string
    steps: Array<UpdateStepForm>
    action?: 'add-another-step' | 'submit-form' | 'delete-step-[0]'
  }

  export interface UpdateStepForm {
    reference?: string
    title?: string
    targetDateRange?:
      | 'ZERO_TO_THREE_MONTHS'
      | 'THREE_TO_SIX_MONTHS'
      | 'SIX_TO_TWELVE_MONTHS'
      | 'MORE_THAN_TWELVE_MONTHS'
    stepNumber: number
    status: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE'
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
    addStepForm: AddStepForm
    addStepForms: Array<AddStepForm>
    addNoteForm: AddNoteForm
  }
}
