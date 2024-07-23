import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'

const aValidCreateGoalRequestWithOneStep = (): CreateGoalRequest => {
  const createStepRequest: CreateStepRequest = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  return {
    title: 'Learn Spanish',
    steps: [createStepRequest],
    targetCompletionDate: '2024-01-01',
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

const aValidCreateGoalRequestWithMultipleSteps = (): CreateGoalRequest => {
  const createStepRequest1: CreateStepRequest = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  const createStepRequest2: CreateStepRequest = {
    title: 'Complete Spanish course',
    sequenceNumber: 2,
  }
  return {
    title: 'Learn Spanish',
    steps: [createStepRequest1, createStepRequest2],
    targetCompletionDate: '2024-01-01',
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidCreateGoalRequestWithOneStep, aValidCreateGoalRequestWithMultipleSteps }
