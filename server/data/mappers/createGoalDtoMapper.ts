import type { CreateGoalsForm } from 'forms'
import type { AddStepDto, CreateGoalDto } from 'dto'
import { addMonths, parse, startOfToday } from 'date-fns'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

const toCreateGoalDtos = (createGoalsForm: CreateGoalsForm, prisonId: string): Array<CreateGoalDto> => {
  return (createGoalsForm?.goals || []).map(goal => {
    return {
      prisonNumber: createGoalsForm.prisonNumber,
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

const toTargetCompletionDate = (goalDateFields: {
  targetCompletionDate?: GoalTargetCompletionDateOption
  manuallyEnteredTargetCompletionDate?: string
}): Date => {
  const today = startOfToday()
  switch (goalDateFields.targetCompletionDate) {
    case GoalTargetCompletionDateOption.THREE_MONTHS: {
      return addMonths(today, 3)
    }
    case GoalTargetCompletionDateOption.SIX_MONTHS: {
      return addMonths(today, 6)
    }
    case GoalTargetCompletionDateOption.TWELVE_MONTHS: {
      return addMonths(today, 12)
    }
    default: {
      return parse(goalDateFields.manuallyEnteredTargetCompletionDate, 'd/M/yyyy', today)
    }
  }
}

export default toCreateGoalDtos
