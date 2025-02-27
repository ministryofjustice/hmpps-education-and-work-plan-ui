import type { AddStepDto, CreateGoalDto } from 'dto'
import { startOfDay } from 'date-fns'

const aValidCreateGoalDtoWithOneStep = (title = 'Learn Spanish'): CreateGoalDto => {
  const addStepDto: AddStepDto = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  return {
    prisonNumber: 'A1234BC',
    title,
    steps: [addStepDto],
    targetCompletionDate: startOfDay('2024-01-01'),
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

const aValidCreateGoalDtoWithMultipleSteps = (title = 'Learn Spanish'): CreateGoalDto => {
  const addStepDto1: AddStepDto = {
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  const addStepDto2: AddStepDto = {
    title: 'Complete Spanish course',
    sequenceNumber: 2,
  }
  return {
    prisonNumber: 'A1234BC',
    title,
    steps: [addStepDto1, addStepDto2],
    targetCompletionDate: startOfDay('2024-01-01'),
    note: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidCreateGoalDtoWithOneStep, aValidCreateGoalDtoWithMultipleSteps }
