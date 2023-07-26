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

  export interface ActionPlanDto {
    prisonNumber: string
    goals: Array<GoalDto>
  }

  export interface GoalDto {
    goalReference: string
    title: string
    status: string
    steps: Array<StepDto>
    createdBy: string
    createdByDisplayName: string
    createdAt: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: string
    reviewDate?: string
    note?: string
  }

  export interface StepDto {
    stepReference: string
    title: string
    targetDateRange: string
    status: string
    sequenceNumber: number
  }
}
