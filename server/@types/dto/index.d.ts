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

  export interface UpdateGoalDto {
    goalReference: string
    title: string
    status: string
    steps: Array<UpdateStepDto>
    reviewDate?: string
    notes?: string
  }

  export interface UpdateStepDto {
    stepReference: string
    status: string
    title: string
    targetDateRange: string
    sequenceNumber: number
  }
}
