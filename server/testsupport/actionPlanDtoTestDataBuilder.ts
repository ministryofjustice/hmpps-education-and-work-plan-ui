import type { StepDto, GoalDto, ActionPlanDto } from 'dto'

const aValidActionPlanDtoWithOneGoal = (): ActionPlanDto => {
  return {
    prisonNumber: 'A1234BC',
    goals: [aValidGoalDto()],
  }
}
const aValidGoalDto = (): GoalDto => {
  return {
    goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
    title: 'Learn Spanish',
    status: 'ACTIVE',
    steps: [aValidFirstStepDto(), aValidSecondStepDto()],
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '',
    note: 'Prisoner is not good at listening',
  }
}

const aValidFirstStepDto = (): StepDto => {
  return {
    stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    status: 'ACTIVE',
    sequenceNumber: 1,
  }
}

const aValidSecondStepDto = (): StepDto => {
  return {
    stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    status: 'NOT_STARTED',
    sequenceNumber: 2,
  }
}

export { aValidActionPlanDtoWithOneGoal, aValidGoalDto }
