import type { CreateGoalRequest, CreateStepRequest } from 'educationAndWorkPlanApiClient'
import moment from 'moment'

const aValidCreateGoalRequestWithOneStep = (prisonNumber = 'A1234BC'): CreateGoalRequest => {
  const createStepRequest: CreateStepRequest = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  return {
    prisonNumber,
    title: 'Learn Spanish',
    steps: [createStepRequest],
    targetCompletionDate: moment('2024-01-01').toDate(),
    notes: 'Prisoner is not good at listening',
    category: 'WORK',
    prisonId: 'BXI',
  }
}

const aValidCreateGoalRequestWithMultipleSteps = (prisonNumber = 'A1234BC'): CreateGoalRequest => {
  const createStepRequest1: CreateStepRequest = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  const createStepRequest2: CreateStepRequest = {
    title: 'Complete Spanish course',
    sequenceNumber: 2,
  }
  return {
    prisonNumber,
    title: 'Learn Spanish',
    steps: [createStepRequest1, createStepRequest2],
    targetCompletionDate: moment('2024-01-01').toDate(),
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidCreateGoalRequestWithOneStep, aValidCreateGoalRequestWithMultipleSteps }
