declare module 'forms' {
  export interface CreateGoalForm {
    readonly prisonNumber: string
    title?: string
    reviewDate?: Date
    'reviewDate-day'?: string
    'reviewDate-month'?: string
    'reviewDate-year'?: string
  }

  export interface AddStepForm {
    title?: string
    targetDate?: Date
    'targetDate-day'?: string
    'targetDate-month'?: string
    'targetDate-year'?: string
  }

  export interface AddNoteForm {
    notes?: string
  }
}
