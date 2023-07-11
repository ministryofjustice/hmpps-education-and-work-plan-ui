declare module 'forms' {
  export interface CreateGoalForm {
    prisonNumber: string
    title?: string
  }

  export interface AddStepForm {
    stepNumber: number
    title?: string
    targetDateRange?: string
    action?: string
  }

  export interface AddNoteForm {
    note?: string
  }
}
