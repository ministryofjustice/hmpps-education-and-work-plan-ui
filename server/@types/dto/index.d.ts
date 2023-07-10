declare module 'dto' {
  export interface CreateGoalDto {
    prisonNumber: string
    title: string
    reviewDate: Date
    steps: Array<AddStepDto>
    note?: string
  }

  export interface AddStepDto {
    title: string
    targetDate?: Date
    sequenceNumber: number
  }
}
