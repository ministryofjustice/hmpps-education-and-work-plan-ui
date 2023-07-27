declare module 'dto' {
  export interface CreateGoalDto {
    prisonNumber: string
    title: string
    steps: Array<AddStepDto>
    note?: string
  }

  export interface AddStepDto {
    title: string
    targetDateRange: string
    sequenceNumber: number
  }
}
