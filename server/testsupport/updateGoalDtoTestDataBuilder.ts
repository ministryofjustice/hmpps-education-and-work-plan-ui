import type { UpdateGoalDto, UpdateStepDto } from 'dto'
import { startOfDay } from 'date-fns'
import GoalStatusValue from '../enums/goalStatusValue'
import StepStatusValue from '../enums/stepStatusValue'

const aValidUpdateGoalDtoWithOneStep = (): UpdateGoalDto => {
  const updateStepDto: UpdateStepDto = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    status: StepStatusValue.ACTIVE,
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  return {
    goalReference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
    targetCompletionDate: startOfDay('2024-02-29'),
    status: GoalStatusValue.ACTIVE,
    title: 'Learn Spanish',
    steps: [updateStepDto],
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

const aValidUpdateGoalDtoWithMultipleSteps = (): UpdateGoalDto => {
  const updateStepDto1: UpdateStepDto = {
    stepReference: 'c77cd2fb-40e0-4354-982a-5c8017e92b26',
    status: StepStatusValue.ACTIVE,
    title: 'Book Spanish course',
    sequenceNumber: 1,
  }
  const updateStepDto2: UpdateStepDto = {
    stepReference: 'f2bf8af7-dd89-4305-b312-3a7fbe2d41a3',
    status: StepStatusValue.NOT_STARTED,
    title: 'Complete Spanish course',
    sequenceNumber: 2,
  }
  return {
    goalReference: '95b18362-fe56-4234-9ad2-11ef98b974a3',
    targetCompletionDate: startOfDay('2024-02-29'),
    status: GoalStatusValue.ACTIVE,
    title: 'Learn Spanish',
    steps: [updateStepDto1, updateStepDto2],
    notes: 'Prisoner is not good at listening',
    prisonId: 'BXI',
  }
}

export { aValidUpdateGoalDtoWithOneStep, aValidUpdateGoalDtoWithMultipleSteps }
