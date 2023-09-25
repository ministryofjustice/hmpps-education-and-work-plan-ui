import type { UpdateStepDto, UpdateGoalDto } from 'dto'

const aValidUpdateGoalDtoWithOneStep = (): UpdateGoalDto => {
  const updateStepDto: UpdateStepDto = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    status: 'ACTIVE',
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  return {
    goalReference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
    targetCompletionDate: undefined,
    status: 'ACTIVE',
    title: 'Learn Spanish',
    steps: [updateStepDto],
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

const aValidUpdateGoalDtoWithMultipleSteps = (): UpdateGoalDto => {
  const updateStepDto1: UpdateStepDto = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    status: 'ACTIVE',
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  const updateStepDto2: UpdateStepDto = {
    stepReference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
    status: 'NOT_STARTED',
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    sequenceNumber: 2,
  }
  return {
    goalReference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
    targetCompletionDate: undefined,
    status: 'ACTIVE',
    title: 'Learn Spanish',
    steps: [updateStepDto1, updateStepDto2],
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidUpdateGoalDtoWithOneStep, aValidUpdateGoalDtoWithMultipleSteps }
