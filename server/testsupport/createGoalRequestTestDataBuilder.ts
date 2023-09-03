import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'

const aValidCreateGoalRequestWithOneStep = (prisonNumber = 'A1234BC'): CreateGoalRequest => {
  const createStepRequest: CreateStepRequest = {
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  return {
    prisonNumber,
    title: 'Learn Spanish',
    steps: [createStepRequest],
    notes: 'Prisoner is not good at listening',
    category: 'WORK',
    prisonId: 'BXI',
  }
}

const aValidCreateGoalRequestWithMultipleSteps = (prisonNumber: 'A1234BC'): CreateGoalRequest => {
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
    prisonNumber,
    title: 'Learn Spanish',
    steps: [createStepRequest1, createStepRequest2],
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidCreateGoalRequestWithOneStep, aValidCreateGoalRequestWithMultipleSteps }
