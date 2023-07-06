import type { AddStepDto, CreateGoalDto } from 'dto'
import moment from 'moment/moment'

const aValidCreateGoalDtoWithOneStep = (): CreateGoalDto => {
  const addStepDto: AddStepDto = {
    title: 'Book Spanish course',
    targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    sequenceNumber: 1,
  }
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
    steps: [addStepDto],
    note: 'Prisoner is not good at listening',
  }
}

const aValidCreateGoalDtoWithMultipleSteps = (): CreateGoalDto => {
  const addStepDto1: AddStepDto = {
    title: 'Book Spanish course',
    targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
    sequenceNumber: 1,
  }
  const addStepDto2: AddStepDto = {
    title: 'Complete Spanish course',
    targetDate: moment('2123-03-31', 'YYYY-MM-DD').toDate(),
    sequenceNumber: 2,
  }
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
    steps: [addStepDto1, addStepDto2],
    note: 'Prisoner is not good at listening',
  }
}

export { aValidCreateGoalDtoWithOneStep, aValidCreateGoalDtoWithMultipleSteps }
