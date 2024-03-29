import type { ActionPlanResponse, GoalResponse, StepResponse } from 'educationAndWorkPlanApiClient'

const aValidActionPlanResponseWithOneGoal = (): ActionPlanResponse => {
  return {
    prisonNumber: 'A1234BC',
    goals: [aValidGoalResponse()],
  }
}
const aValidGoalResponse = (): GoalResponse => {
  return {
    goalReference: 'd38a6c41-13d1-1d05-13c2-24619966119b',
    title: 'Learn Spanish',
    status: 'ACTIVE',
    steps: [aValidFirstStepResponse(), aValidSecondStepResponse()],
    createdBy: 'asmith_gen',
    createdByDisplayName: 'Alex Smith',
    createdAt: '2023-01-16T09:34:12.453Z',
    updatedBy: 'asmith_gen',
    updatedByDisplayName: 'Alex Smith',
    updatedAt: '2023-09-23T13:42:01.401Z',
    targetCompletionDate: '2024-02-29T00:00:00.000Z',
    notes: 'Prisoner is not good at listening',
  }
}

const aValidFirstStepResponse = (): StepResponse => {
  return {
    stepReference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
    title: 'Book Spanish course',
    status: 'ACTIVE',
    sequenceNumber: 1,
  }
}

const aValidSecondStepResponse = (): StepResponse => {
  return {
    stepReference: 'dc817ce8-2b2e-4282-96b2-b9a1d831fc56',
    title: 'Complete Spanish course',
    status: 'NOT_STARTED',
    sequenceNumber: 2,
  }
}

export { aValidActionPlanResponseWithOneGoal, aValidGoalResponse }
