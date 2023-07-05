declare module 'dto' {
  export interface CreateGoalDto {
    prisonNumber: string
    title: string
    reviewDate: Date
    steps: [AddStepDto]
    note?: string
  }

  export interface AddStepDto {
    title: string
    targetDate?: Date
  }
}
