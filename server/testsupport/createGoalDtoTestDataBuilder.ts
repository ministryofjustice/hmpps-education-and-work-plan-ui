import type { AddStepDto, CreateGoalDto } from 'dto'
import moment from 'moment/moment'

export default function aValidCreateGoalDto(): CreateGoalDto {
  const addStepDto: AddStepDto = {
    title: 'Book Spanish course',
    targetDate: moment('2123-01-31', 'YYYY-MM-DD').toDate(),
  }
  return {
    prisonNumber: 'A1234BC',
    title: 'Learn Spanish',
    reviewDate: moment('2123-06-30', 'YYYY-MM-DD').toDate(),
    steps: [addStepDto],
    note: 'Prisoner is not good at listening',
  }
}
