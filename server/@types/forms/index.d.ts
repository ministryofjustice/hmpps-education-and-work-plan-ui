declare module 'forms' {
  export interface CreateGoalForm {
    readonly prisonNumber: string
    title?: string
    reviewDate?: Date
    steps?: [
      {
        title?: string
        targetDate?: Date
        sequenceNumber?: number
      },
    ]
    notes?: string
  }
}
