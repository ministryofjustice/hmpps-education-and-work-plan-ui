import type { CreateGoalsForm } from 'forms'
import type { AddStepDto, CreateGoalDto } from 'dto'
import { startOfDay } from 'date-fns'

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
  targetCompletionDate?: string
  'targetCompletionDate-day'?: string
  'targetCompletionDate-month'?: string
  'targetCompletionDate-year'?: string
}): Date => {
  if (goalDateFields.targetCompletionDate) {
    if (goalDateFields.targetCompletionDate === 'another-date') {
      const day = goalDateFields['targetCompletionDate-day'].padStart(2, '0')
      const month = goalDateFields['targetCompletionDate-month'].padStart(2, '0')
      const year = goalDateFields['targetCompletionDate-year']
      return startOfDay(new Date(`${year}-${month}-${day}`))
    }
    return startOfDay(new Date(goalDateFields.targetCompletionDate))
  }
  return null
}

export default toCreateGoalDtos
