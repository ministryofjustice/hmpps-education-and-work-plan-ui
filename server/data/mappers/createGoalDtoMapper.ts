import type { AddStepDto, CreateGoalDto } from 'dto'
import { startOfDay } from 'date-fns'
import { CreateGoalsForm, GoalForm } from '../../routes/createGoal/validators/GoalForm'

const toCreateGoalDtos = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  prisonId: string,
): Array<CreateGoalDto> => {
  return (createGoalsForm?.goals || []).map(goal => {
    return {
      prisonNumber,
      title: goal.title,
      targetCompletionDate: toTargetCompletionDate(goal),
      steps: (goal.steps || []).map((step, stepIndexNumber) => toAddStepDto(step, stepIndexNumber)),
      note: goal.note,
      prisonId,
    }
  })
}

const toAddStepDto = (step: { title?: string }, stepIndexNumber: number): AddStepDto => {
  return {
    title: step.title,
    sequenceNumber: stepIndexNumber + 1,
  }
}

const toTargetCompletionDate = (goalDateFields: GoalForm): Date => {
  if (goalDateFields.targetCompletionDate === 'another-date') {
    return goalDateFields.anotherDate.richDate
  }
  return startOfDay(new Date(goalDateFields.targetCompletionDate))
}

export default toCreateGoalDtos
