import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'

const aValidCreateGoalRequestWithOneStep = (): CreateGoalRequest => {
  const createStepRequest: CreateStepRequest = {
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    steps: [createStepRequest],
    notes: 'Prisoner is not good at listening',
    category: 'WORK',
  }
}

const aValidCreateGoalRequestWithMultipleSteps = (): CreateGoalRequest => {
  const createStepRequest1: CreateStepRequest = {
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  const createStepRequest2: CreateStepRequest = {
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    sequenceNumber: 2,
  }
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    steps: [createStepRequest1, createStepRequest2],
    note: 'Prisoner is not good at listening',
  }
}

export { aValidCreateGoalRequestWithOneStep, aValidCreateGoalRequestWithMultipleSteps }
