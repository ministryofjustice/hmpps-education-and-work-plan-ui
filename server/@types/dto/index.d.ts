declare module 'dto' {
  export interface CreateGoalDto {
    prisonNumber: string
    title: string
    steps: Array<AddStepDto>
    targetCompletionDate?: string
    note?: string
    prisonId: string
  }

  export interface AddStepDto {
    title: string
    sequenceNumber: number
  }

  export interface UpdateGoalDto {
    goalReference: string
    title: string
    status: string
    steps: Array<UpdateStepDto>
    targetCompletionDate?: string
    notes?: string
    prisonId: string
  }

  export interface UpdateStepDto {
    stepReference: string
    status: string
    title: string
    sequenceNumber: number
  }
}
