import type { AddStepDto, CreateGoalDto } from 'dto'
import { addMonths, startOfToday } from 'date-fns'
import {
  CreateGoalsForm,
  GoalCompleteDateOptions,
  GoalForm,
  StepInput,
} from '../../routes/createGoal/validators/GoalForm'

const toCreateGoalDtos = (
  createGoalsForm: CreateGoalsForm,
  prisonNumber: string,
  prisonId: string,
): Array<CreateGoalDto> => {
  return (
    createGoalsForm?.goals.map(goal => {
      return {
        prisonNumber,
        title: goal.title,
        targetCompletionDate: getTargetDate(goal),
        steps: goal.steps?.map((step, stepIndexNumber) => toAddStepDto(step, stepIndexNumber)) ?? [],
        note: goal.note,
        prisonId,
      }
    }) ?? []
  )
}

const toAddStepDto = (step: StepInput, stepIndexNumber: number): AddStepDto => ({
  title: step.title,
  sequenceNumber: stepIndexNumber + 1,
})

const getTargetDate = (form: GoalForm) => {
  const now = startOfToday()
  if (form.targetCompletionDateOption === GoalCompleteDateOptions.THREE_MONTHS) return addMonths(now, 3)
  if (form.targetCompletionDateOption === GoalCompleteDateOptions.SIX_MONTHS) return addMonths(now, 6)
  if (form.targetCompletionDateOption === GoalCompleteDateOptions.TWELVE_MONTHS) return addMonths(now, 12)
  return form.anotherDate.richDate
}

export default toCreateGoalDtos
