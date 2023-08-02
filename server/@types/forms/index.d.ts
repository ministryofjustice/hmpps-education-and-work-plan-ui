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

  export interface UpdateGoalForm {
    reference: string
    title?: string
    reviewDate?: string
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
    note?: string
    steps: Array<{
      reference: string
      title?: string
      targetDateRange?:
        | 'ZERO_TO_THREE_MONTHS'
        | 'THREE_TO_SIX_MONTHS'
        | 'SIX_TO_TWELVE_MONTHS'
        | 'MORE_THAN_TWELVE_MONTHS'
      stepNumber?: number
      status?: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETE'
    }>
  }
}
