declare module 'forms' {
  export interface CreateGoalForm {
    prisonNumber: string
    title?: string
    reviewDate?: Date
    'reviewDate-day'?: string
    'reviewDate-month'?: string
    'reviewDate-year'?: string
  }

  export interface AddStepForm {
    stepNumber: number
    title?: string
    targetDate?: Date
    'targetDate-day'?: string
    'targetDate-month'?: string
    'targetDate-year'?: string
    action?: string
  }

  export interface AddNoteForm {
    note?: string
  }
}
