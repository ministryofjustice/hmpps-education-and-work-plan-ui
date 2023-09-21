import type { AddStepDto, CreateGoalDto } from 'dto'

const aValidCreateGoalDtoWithOneStep = (title = 'Learn Spanish'): CreateGoalDto => {
  const addStepDto: AddStepDto = {
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  return {
    prisonNumber: 'A1234BC',
    title,
    steps: [addStepDto],
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

const aValidCreateGoalDtoWithMultipleSteps = (title = 'Learn Spanish'): CreateGoalDto => {
  const addStepDto1: AddStepDto = {
    title: 'Book Spanish course',
    targetDateRange: 'ZERO_TO_THREE_MONTHS',
    sequenceNumber: 1,
  }
  const addStepDto2: AddStepDto = {
    title: 'Complete Spanish course',
    targetDateRange: 'THREE_TO_SIX_MONTHS',
    sequenceNumber: 2,
  }
  return {
    prisonNumber: 'A1234BC',
    title,
    steps: [addStepDto1, addStepDto2],
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidCreateGoalDtoWithOneStep, aValidCreateGoalDtoWithMultipleSteps }
